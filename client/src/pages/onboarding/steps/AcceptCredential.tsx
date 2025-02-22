import type { Character, CredentialData } from '../../../slices/types'
import type { Content } from '../../../utils/OnboardingUtils'
import type { CredReqMetadata } from 'indy-sdk'

import { CredentialRecord, JsonTransformer } from '@aries-framework/core'
import { AnimatePresence, motion } from 'framer-motion'
import { track } from 'insights-js'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { fade, fadeX } from '../../../FramerAnimations'
import { ActionCTA } from '../../../components/ActionCTA'
import { Loader } from '../../../components/Loader'
import { Modal } from '../../../components/Modal'
import { useAppDispatch } from '../../../hooks/hooks'
import { useInterval } from '../../../hooks/useInterval'
import { useConnection } from '../../../slices/connection/connectionSelectors'
import { clearConnection } from '../../../slices/connection/connectionSlice'
import { useCredentials } from '../../../slices/credentials/credentialsSelectors'
import { clearCredentials } from '../../../slices/credentials/credentialsSlice'
import {
  deleteCredentialById,
  fetchCredentialsByConId,
  issueCredential,
  issueDeepCredential,
} from '../../../slices/credentials/credentialsThunks'
import { basePath } from '../../../utils/BasePath'
import { FailedRequestModal } from '../components/FailedRequestModal'
import { StarterCredentials } from '../components/StarterCredentials'
import { StepInformation } from '../components/StepInformation'

export interface Props {
  content?: Content
  connectionId: string
  credentials: CredentialRecord[]
  currentCharacter: Character
  credSelection: number[]
  title: string
  text: string
}

export const AcceptCredential: React.FC<Props> = ({
  content,
  connectionId,
  credentials,
  currentCharacter,
  credSelection,
  title,
  text,
}) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [isRejectedModalOpen, setIsRejectedModalOpen] = useState(false)
  const [isFailedRequestModalOpen, setIsFailedRequestModalOpen] = useState(false)
  const [credentialsIssued, setCredentialsIssued] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const { isIssueCredentialLoading, error } = useCredentials()

  const { isDeepLink } = useConnection()

  const showFailedRequestModal = () => setIsFailedRequestModalOpen(true)
  const closeFailedRequestModal = () => setIsFailedRequestModalOpen(false)

  const getCharacterCreds = (): CredentialData[] => {
    const creds: CredentialData[] = []
    credSelection.forEach((item) => {
      if (currentCharacter.starterCredentials[item]) {
        creds.push(currentCharacter.starterCredentials[item])
      }
    })
    return creds
  }

  const credentialsAccepted = Object.values(credentials).every(
    (x) => x.state === 'credential-issued' || x.state === 'done'
  )

  useEffect(() => {
    if (credentials.length === 0) {
      getCharacterCreds().forEach((item) => {
        if (item !== undefined) {
          if (isDeepLink) {
            dispatch(issueDeepCredential({ connectionId: connectionId, cred: item }))
          } else {
            dispatch(issueCredential({ connectionId: connectionId, cred: item }))
          }
          track({
            id: 'credential-issued',
          })
        }
      })
      setCredentialsIssued(true)
    }
  }, [currentCharacter.starterCredentials, connectionId])

  const handleCredentialTimeout = () => {
    if (!isIssueCredentialLoading || !error) return
    setErrorMsg(
      `The request timed out. We're sorry, but you're going to have to restart the demo. If this issue persists, please contact us.`
    )
    setIsRejectedModalOpen(true)
  }

  useEffect(() => {
    if (credentialsIssued) {
      setTimeout(() => {
        handleCredentialTimeout()
      }, 10000)
    }
  }, [credentialsIssued, isIssueCredentialLoading])

  useEffect(() => {
    if (error) {
      const msg = error.message ?? 'Issue Credential Error'
      setErrorMsg(
        `The request has failed with the following error: ${msg}. We're sorry, but you're going to have to restart. If this issue persists, please contact us. `
      )
      setIsRejectedModalOpen(true)
    }
  }, [error])

  useInterval(
    () => {
      if (document.visibilityState === 'visible') dispatch(fetchCredentialsByConId(connectionId))
    },
    !credentialsAccepted ? 1000 : null
  )

  const routeError = () => {
    navigate(`${basePath}/demo`)
    dispatch({ type: 'demo/RESET' })
  }

  const sendNewCredentials = () => {
    credentials.forEach((cred) => {
      if (cred.state !== 'credential-issued' && cred.state !== 'done') {
        dispatch(deleteCredentialById(cred.id))

        const newCredential = getCharacterCreds().find((item) => {
          const credClass = JsonTransformer.fromJSON(cred, CredentialRecord)
          return (
            item?.credentialDefinitionId ===
            credClass.metadata.get<CredReqMetadata>('_internal/indyCredential')?.credentialDefinitionId
          )
        })

        if (newCredential) dispatch(issueCredential({ connectionId: connectionId, cred: newCredential }))
      }
    })
    closeFailedRequestModal()
  }

  return (
    <motion.div className="flex flex-col h-full" variants={fadeX} initial="hidden" animate="show" exit="exit">
      <StepInformation title={title ?? content?.title} text={text ?? content?.text} />
      <div className="flex flex-row m-auto content-center">
        {getCharacterCreds().length === credentials.length ? (
          <AnimatePresence exitBeforeEnter>
            <motion.div className={`flex flex-1 flex-col m-auto`} variants={fade} animate="show" exit="exit">
              <StarterCredentials credentialData={getCharacterCreds()} credentials={credentials} />
            </motion.div>
          </AnimatePresence>
        ) : (
          <motion.div className="flex flex-col h-full m-auto">
            <Loader />
          </motion.div>
        )}
        {isFailedRequestModalOpen && (
          <FailedRequestModal key="credentialModal" action={sendNewCredentials} close={closeFailedRequestModal} />
        )}
        {isRejectedModalOpen && (
          <Modal title={'There seems to be an issue.'} description={errorMsg} onOk={routeError} />
        )}
      </div>
      <ActionCTA isCompleted={credentialsAccepted && credentials.length > 0} onFail={showFailedRequestModal} />
    </motion.div>
  )
}

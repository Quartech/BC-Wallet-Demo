import type { CredentialData, RequestedCredential, UseCase } from '../../../slices/types'
import type { CredentialRecord } from '@aries-framework/core'
import type { CredReqMetadata } from 'indy-sdk'

// import { CredentialRecord, JsonTransformer } from '@aries-framework/core'
import { motion } from 'framer-motion'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { dashboardSub, dashboardTitle, rowContainer } from '../../../FramerAnimations'
import { basePath } from '../../../utils/BasePath'

import { UseCaseItem } from './UseCaseItem'

export interface Props {
  useCases: UseCase[]
  issuedCredentials: CredentialRecord[]
  completedUseCaseSlugs: string[]
}

export const UseCaseContainer: React.FC<Props> = ({ useCases, completedUseCaseSlugs, issuedCredentials }) => {
  const navigate = useNavigate()

  const startUseCase = (slug: string) => {
    navigate(`${basePath}/uc/${slug}`)
  }

  const renderUseCases = useCases.map((item) => {
    const issueCredentials = item.sections.flatMap((x) => x.issueCredentials).filter((y) => y) as CredentialData[]

    const requiredCredentials = item.sections
      .flatMap((x) => x.requestedCredentials)
      .filter((o) => !issueCredentials.find((obj) => obj.name === o?.name))
      .filter((y) => y) as RequestedCredential[]

    // const isLocked = !Object.values(requiredCredentials).every((x) =>
    //   issuedCredentials
    //     .map((y) => {
    //       const z = JsonTransformer.fromJSON(y, CredentialRecord)
    //       return z.metadata.get<CredReqMetadata>('_internal/indyCredential')?.credentialDefinitionId
    //     })
    //     .includes(x.credentialDefinitionId)
    // )

    const isCompleted = completedUseCaseSlugs.includes(item.slug)

    return (
      <UseCaseItem
        key={item.slug}
        slug={item.slug}
        card={item.card}
        requiredCredentials={requiredCredentials}
        start={startUseCase}
        isLocked={false}
        isCompleted={isCompleted}
      />
    )
  })

  return (
    <div className="flex flex-col mx-4 lg:mx-4 my-2 p-4 md:p-6 lg:p-8 bg-white dark:bg-bcgov-darkgrey dark:text-white rounded-lg shadow-sm">
      <motion.h1 variants={dashboardTitle} className="text-3xl md:text-4xl font-bold mb-2">
        Using your credentials
      </motion.h1>
      <motion.div variants={rowContainer} className="flex flex-col w-auto overflow-x-hidden md:overflow-x-visible">
        {renderUseCases}
      </motion.div>
    </div>
  )
}

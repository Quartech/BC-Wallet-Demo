import type { CredentialData } from '../../../slices/types'
import type { CredentialRecord } from '@aries-framework/core'

import { motion } from 'framer-motion'
import React from 'react'

import { fadeX } from '../../../FramerAnimations'
import { StateIndicator } from '../../../components/StateIndicator'
import { prependApiUrl } from '../../../utils/Url'

export interface Props {
  title: string
  data: CredentialData
  credential: CredentialRecord
}

export const Credential: React.FC<Props> = ({ title, credential, data }) => {
  const credentialIssued = credential.state === 'credential-issued' || credential.state === 'done'
  return (
    <motion.div
      variants={fadeX}
      animate="show"
      exit="exit"
      className="flex flex-col bg-bcgov-white dark:bg-bcgov-black m-4 px-4 py-2 w-72 md:w-96 h-28 rounded-lg shadow"
    >
      <div className="flex-1-1 title">
        <h1 className="font-semibold dark:text-white">{title}</h1>
        <hr className="text-bcgov-lightgrey" />
      </div>
      <div className="flex-1 flex flex-row items-center justify-between">
        <div className="bg-bcgov-lightgrey rounded-lg p-2 w-12">
          <img className="h-8 m-auto" src={prependApiUrl(data.icon)} alt="icon" />
        </div>
        <div className="flex-1 px-4 justify-self-start dark:text-white">
          <p>{data.name}</p>
        </div>
        <StateIndicator completed={credentialIssued} />
      </div>
    </motion.div>
  )
}

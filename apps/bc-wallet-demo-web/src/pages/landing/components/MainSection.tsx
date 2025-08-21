import React from 'react'

import { motion } from 'framer-motion'

import { walletBaseUrl } from '../../../api/BaseUrl'
import { fadeDelay, landingTitle } from '../../../FramerAnimations'

// Hardcoded array of available showcases
const availableShowcases = [
  {
    id: 1,
    name: 'California DMV mDL Showcase',
    status: 'Available',
    url: `${walletBaseUrl}/showcase-manager-tenant/california-dmv-mdl-showcase`,
  },
  {
    id: 2,
    name: 'Los Angeles Metro Volunteer',
    status: 'Available',
    url: `${walletBaseUrl}/showcase-manager-tenant/la-metro-volunteer-showcase`,
  },
]

export const MainSection: React.FC = () => {
  const renderTitle = (
    <motion.div className="flex-1 text-left text-bcgov-black dark:text-bcgov-white font-semibold text-4xl lg:text-5xl xl:text-6xl m-auto">
      <div className="overflow-hidden py-1 leading-tight">
        <motion.h1 variants={landingTitle}>Verifiable Credential Showcase</motion.h1>
      </div>
      <div className="overflow-hidden">
        <motion.h2
          variants={fadeDelay}
          className="text-base lg:text-lg font-normal mt-6 dark:text-bcgov-lightgrey text-bcgov-darkgrey"
        >
          Explore how you can use Verifiable Credentials to prove things about yourself, in a way that's safe and
          secure.
        </motion.h2>
      </div>
    </motion.div>
  )

  const renderShowcasesTable = (
    <motion.div className="flex-1 flex items-center justify-center p-6" variants={fadeDelay}>
      <div className="bg-white dark:bg-bcgov-darkgrey rounded-lg shadow-lg overflow-hidden w-full">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-bcgov-black dark:text-bcgov-white">Available Showcases</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/2">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/4">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/4">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-bcgov-darkgrey divide-y divide-gray-200 dark:divide-gray-700">
              {availableShowcases.map((showcase) => (
                <tr key={showcase.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 text-sm font-medium text-bcgov-black dark:text-bcgov-white">
                    {showcase.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        showcase.status === 'Available'
                          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                          : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                      }`}
                    >
                      {showcase.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                    <button
                      className="bg-bcgov-blue dark:bg-bcgov-white text-bcgov-white dark:text-bcgov-black py-2 px-4 rounded-lg font-semibold shadow-sm dark:shadow-none select-none hover:opacity-90 transition-opacity"
                      onClick={() => (window.location.href = showcase.url)}
                    >
                      Try Demo
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  )

  return (
    <motion.div
      className="flex flex-col md:flex-row dark:text-white flex-grow items-center"
      initial="hidden"
      animate="show"
      exit="exit"
    >
      {renderTitle}
      {renderShowcasesTable}
    </motion.div>
  )
}

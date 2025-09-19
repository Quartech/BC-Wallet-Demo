import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// import { trackPageView } from '@snowplow/browser-tracker'
import { motion, AnimatePresence } from 'framer-motion'

import { Loader } from '../../components/Loader'
import { Modal } from '../../components/Modal'
import { page } from '../../FramerAnimations'
import { useAppDispatch } from '../../hooks/hooks'
import { useTitle } from '../../hooks/useTitle'
import { useConnection } from '../../slices/connection/connectionSelectors'
import { useProof } from '../../slices/proof/proofSelectors'
import { useShowcases } from '../../slices/showcases/showcasesSelectors'
import { clearShowcase } from '../../slices/showcases/showcasesSlice'
import { fetchPersonaBySlug, fetchScenarioBySlug, fetchShowcaseBySlug } from '../../slices/showcases/showcasesThunks'
import type { PresentationScenario } from '../../slices/types'
import { useUseCaseState } from '../../slices/useCases/useCasesSelectors'
import { basePath } from '../../utils/BasePath'
import { usePersonaSlug, useScenarioSlug, useSlug } from '../../utils/SlugUtils'
import { PageNotFound } from '../PageNotFound'
import { Section } from './Section'

export const UseCasePage: React.FC = () => {
  const dispatch = useAppDispatch()
  const { isLoading } = useUseCaseState()
  const { showcase, currentPersona, currentScenario } = useShowcases()
  console.log('showcase', showcase);
  console.log('currentScenario', currentScenario);
  console.log('currentPersona', currentPersona);
  const connection = useConnection()
  const { proof } = useProof()
  const showcaseSlug = useSlug()
  const personaSlug = usePersonaSlug()
  const scenarioSlug = useScenarioSlug()

  const navigate = useNavigate()
  useTitle(`${currentScenario?.name ?? 'Use case'} | BC Wallet Self-Sovereign Identity Demo`)

  // useEffect(() => {
  //   trackPageView()
  // }, [])

  useEffect(() => {
    const load = async () => {
      dispatch(clearShowcase())
      await dispatch(fetchShowcaseBySlug(showcaseSlug))
      await dispatch(fetchPersonaBySlug(personaSlug))
      await dispatch(fetchScenarioBySlug(scenarioSlug))
    }
    void load()
  }, [dispatch, showcaseSlug, personaSlug, scenarioSlug])

  if (showcase === undefined || currentPersona === undefined || currentScenario === undefined) {
    return <div>Loading...</div>
  }

  if (showcase === null) {
    return <PageNotFound resourceType="Showcase" resourceName={showcaseSlug} />
  }

  if (currentPersona === null) {
    return <PageNotFound resourceType="Persona" resourceName={personaSlug} />
  }

  if (currentScenario === null) {
    return <PageNotFound resourceType="Scenario" resourceName={scenarioSlug} />
  }

  const ERROR_TITLE = `Woops...`
  const ERROR_DESCRIPTION = `That's not gone well. Please restart the demo.`
  const routeError = () => {
    navigate(`${basePath}/`)
  }

  return (
    <motion.div
      variants={page}
      initial="hidden"
      animate="show"
      exit="exit"
      className="container flex flex-col h-auto lg:h-screen p-4 lg:p-6 xl:p-8 dark:text-white"
    >
      {isLoading ? (
        <div className="m-auto">
          <Loader />
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {showcase && currentPersona && currentScenario ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ when: 'afterChildren' }}
              exit={{ opacity: 0 }}
              className="h-full pb-16"
            >
              <Section
                showcase={showcase}
                currentPersona={currentPersona}
                currentScenario={currentScenario as PresentationScenario}
                connection={connection}
                proof={proof}
              />
            </motion.div>
          ) : (
            <Modal key="errorModal" title={ERROR_TITLE} description={ERROR_DESCRIPTION} onOk={routeError} />
          )}
        </AnimatePresence>
      )}
    </motion.div>
  )
}

import {
  AcceptCredentialAction,
  AriesOOBAction,
  ButtonAction,
  ChooseWalletAction,
  IssuanceScenario,
  IssuanceScenarioRequest,
  SetupConnectionAction,
  ShowcaseRequest,
  Step,
  StepActionRequest,
  StepRequest,
  Showcase,
  AriesOOBActionRequest,
  AcceptCredentialActionRequest,
  ChooseWalletActionRequest,
  SetupConnectionActionRequest,
  ButtonActionRequest,
  PresentationScenario,
  PresentationScenarioRequest,
} from 'bc-wallet-openapi'

export const showcaseToShowcaseRequest = (showcase: Showcase): ShowcaseRequest & { slug: string } => {
  console.log('showcase', showcase);
  return {
    name: showcase.name,
    tenantId: showcase.tenantId,
    slug: showcase.slug,
    scenarios: showcase.scenarios.map((scenario) => scenario.id),
    personas: showcase.personas.map((persona) => persona.id),
    bannerImage: showcase.bannerImage?.id,
    description: showcase.description,
    status: showcase.status,
    hidden: showcase.hidden,
    completionMessage: showcase.completionMessage,
    relyingPartyName: showcase.relyingPartyName,
  }
}

export const issuanceScenarioToIssuanceScenarioRequest = (
  issuanceScenario: IssuanceScenario,
): IssuanceScenarioRequest & { slug: string } => {
  console.log('issuanceScenario', issuanceScenario);
  return {
    name: issuanceScenario.name,
    slug: issuanceScenario.slug,
    description: issuanceScenario.description,
    steps: issuanceScenario.steps.map((step) => stepToStepRequest(step)),
    personas: issuanceScenario.personas.map((persona) => persona.id),
    issuer: issuanceScenario.issuer?.id,
    hidden: false,
  }
}

export const stepToStepRequest = (step: Step): StepRequest => {
  return {
    actions: (step.actions || []).map((action) => actionToStepRequestAction(action)),
    ...(step.asset && { asset: step.asset.id }),
    type: step.type,
    order: step.order,
    title: step.title,
    description: step.description,
  }
}

export const actionToStepRequestAction = (
  action: AcceptCredentialAction | AriesOOBAction | ButtonAction | ChooseWalletAction | SetupConnectionAction,
): StepActionRequest => {
  if (action.actionType === 'ACCEPT_CREDENTIAL') {
    return {
      actionType: action.actionType,
      title: action.title,
      text: action.text,
      credentialDefinitionId: (action as AcceptCredentialAction).credentialDefinitionId,
      ...((action as AcceptCredentialAction).connectionId && {
        connectionId: (action as AcceptCredentialAction).connectionId,
      }),
    } as AcceptCredentialActionRequest
  }

  if (action.actionType === 'ARIES_OOB') {
    return {
      actionType: action.actionType,
      title: action.title,
      text: action.text,
      credentialDefinitionId: (action as AriesOOBAction).credentialDefinitionId,
      proofRequest: (action as AriesOOBAction).proofRequest,
    } as AriesOOBActionRequest
  }

  if (action.actionType === 'BUTTON') {
    return {
      actionType: action.actionType,
      title: action.title,
      text: action.text,
      goToStep: (action as ButtonAction).goToStep,
    } as ButtonActionRequest
  }

  if (action.actionType === 'CHOOSE_WALLET') {
    return {
      actionType: action.actionType,
      title: action.title,
      text: action.text,
    } as ChooseWalletActionRequest
  }

  if (action.actionType === 'SETUP_CONNECTION') {
    return {
      actionType: action.actionType,
      title: action.title,
      text: action.text,
    } as SetupConnectionActionRequest
  }

  return {} as StepActionRequest
}

export const presentationScenarioToPresentationScenarioRequest = (
  presentationScenario: PresentationScenario,
): PresentationScenarioRequest & { slug: string } => {
  return {
    name: presentationScenario.name,
    slug: presentationScenario.slug,
    description: presentationScenario.description,
    steps: presentationScenario.steps.map((step) => stepToStepRequest(step)),
    personas: presentationScenario.personas.map((persona) => persona.id),
    relyingParty: presentationScenario.relyingParty?.id,
    hidden: false,
  }
}
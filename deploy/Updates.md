# Updates Needed

## 2025-08-01

### Home Page
- When a showcase is created, there is a label `Created By Test college` that is not needed.
    - `Created By Test college` should be removed or able to be updated.

### Showcase Creator
- During the creation of a showcase, on the Onboarding page.
    - The first `Step` is "Meet `character name`" 
    - This step is auto skipped to during the showcase. when the user clicks a persona.
    - If all these init steps are removed then the showcase can soft-lock.
        - If the first step is a `Connect` step, then the showcase will soft-lock as the user will not be able to proceed.

- During the creation of a showcase, on the Scenarios page.
    - None of the Conditions are working for credential confirmation.

- During any step of the creation of a showcase, data does not save consistently as saving is based onChange of the input.
    - Sometimes doesn't trigger when clicking the `Next` button.


### Showcase Page
- After accepting the first credential, the user is not able to proceed to the next step.
    - The user is not able to click the `Next` button. It stays disabled.
    - Have to press `Back` button then `Already have a credential` button to proceed.

#### Presentation
- Moving onto the Presentation page, Title says `Using your credentials`
    - Then says `Add your student exam results`. This is not correct. and not editable.

- Showcase Completed, Dialog says `Based on code by ____` this should be removed.


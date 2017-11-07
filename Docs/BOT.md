# Bot Milestone

## Use Case Refinement
Based on our feedback we have changed the architecture and usecases descriptions. Our use cases have been changed as follows:

Use Cases
---
```

Use Case 1: Provision a new Virtual Machine.
1. Preconditions
The user shall have Digital Ocean account with valid access keys. User shall also have a valid Slack API token on their system.

2. Main Flow:
User requests the AutoBot to provision a new Virtual Machine [S1]. AutoBot queries  the flavor of the requested machine [S2]. User selects the flavor of the VM [S3]. AutoBot queries configuration parameters [S4]. User provides configuration parameters [S5]. AutoBot creates a VM with provided parameters [S6]. 

3. SubFlows
   [S1] User requests the bot to provision a new Virtual Machine.
   [S2] The AutoBot shows different kinds of VMs to the user to select one of them. (plain   or flavored VM)
   [S3] The user selects one of the provided kind of VM.
   [S4] The AutoBot asks different configuration parameters from the user.
   [S5] The user provides configuration parameters.
   [S6] The AutoBot configured a VM based on the user selections and returns the configuration details of the created VM including access link, and credentials

4. Alternative Flows
   [E1] The AutoBot was not able to create a new VM based on some errors, returns a failure message to the user.For example - error- "The user has reached the limit of VM’s he can create".

````
````
  
Use Case 2: Setup virtual machine with Eclipse and selective plugins installed using Packer.
1. Preconditions
User shall have a valid Slack API token on their system, and eclipse installed in the environment.

2. Main Flow
User requests the AutoBot for a VM image with Eclipse pre-configured[S1]. AutoBot queries user whether or not to install any specific plugins on the configured eclipse[S2]. The user provides plugins to be installed[S3]. The AutoBot build VM image with eclipse and plugins configured using packer Io and gives the image back to user[S4].

3. Subflows : 
   [S1] User requests the AutoBot to setup a virtual machine image with eclipse installed on it
   [S2] The AutoBot provides the list of available plugins and ask the user the select some of them. 
   [S3] The user selects desired plugins from the provided list.
   [S4] AutoBot creates a VM image and provides a download link.

4. Alternative Flows
   [E1] User wants plugins that do not exist in the list of plugins which the bot can install.
   [E2] AutoBot was not able to install the desired plugins, because of some errors: like internet issue/ download error.

````
````

Use Case 3: Management of Virtual Machines. 
1. Preconditions
The user shall have a Digital Ocean account with valid access keys. User shall also have a valid  Slack API token on their system. User shall have access to email service to read the OTP sent.

2. Main Flow
User requests the AutoBot to manage his VMs[S1]. The AutoBot shows all the user’s reserved VMs [S2]. The user selects a specific VM [S3]. The AutoBot queries user regarding the desired action on a selected VM: delete or configuration change [S4]. The user chooses from the list of actions [S5]. The AutoBot queries required parameters if needed [S6]. The user provides necessary parameters [S7].The Autobot requests confirmation from the user (OTP via email) [S8]. The user confirms the request [S9]. The Autobot changed the selected VM [S10].

3. Subflows
   [S1] User requests the AutoBot to manage VMs.
   [S2] The AutoBot lists all the user’s reserved VMs.
   [S3] User selects a specific VM to change.
   [S4] AutoBot queries the user to select a specific action for the selected VM: delete or change configuration
   [S5] The user selects one option. It can be one of the configuration change or tear down the machine. 
   [S6] The AutoBot queries the required parameter of that configuration.(if needed. For example to tear down the VM no parameter is needed)
   [S7] The user enters different parameters (if needed).
   [S8] The Autobot request for providing OTP as a confirmation to change the VM. 
   [S9] The user confirms the request by providing valid OTP.
   [S10] The AutoBot changes the configuration of the selected VM based on given parameters or tears down it.

4. Alternative Flows
   [E1] The AutoBot is not able to configure the VM based on errors it may encounter and returns the failure message to the user.
   [E2] The user has no reserved VMs.
   [E3] The AutoBot is not able to delete the VM based on some errors and returns the failure message to the user.
   [E4] The user does not want to delete the VM after entering the main flow and request to go back to main menu.
   [E5] The user provided incorrect OTP, retry again with the OTP in his/her email.
   [E6] AutoBot locks delete Action for the user, after three incorrect attempts. AutoBot unlocks the delete action, after 10 minutes. 

````
## Mocking Service Component

We use "nock" to mock our api calls. In the following table you can see api calls that are mocked. The mock data files are located in [Mock.json](https://github.ncsu.edu/bbansal/AutoBots/tree/master/serviceManager/DigitalOcean/mockData).

| Action   | api  
| ------------- | ------------ 
| Create a new vm     | POST /v2/droplets         
| Get IP of a vm      | GET /v2/droplets/:dropletId
| Delete a vm         | DELETE /v2/droplets/:dropletId
| Update a vm         | POST /v2/droplets/:dropletId/actions
| Validate DigitalOcean Key | GET /v2/account

## Bot Implementation

* **Bot Platform**: We use Botkit to intercept and reply to messages between the User and the AutoBot that is a nodejs application. 
* **Bot Integration**: We use API.AI to have natural language understanding in AutoBot. Using API.AI helps user to send intercepted messages and get an intent. These intents are mapped to actions in AutoBot. 

## Selenium Testing

We use selenium to test  the AutoBot response based on the input. The selenium test is [Selenium Testing](https://github.ncsu.edu/bbansal/AutoBots/tree/master/Selenium). 

## Task Tracking

We use Trello Cards and Pivotal Tasks to perform task tracking of this project. We define one Trello card for each task : Use case refinement, Mocking Service Components, Bot Integration, Bot Platform, Selenium Testing and Creating Screencast. In each Card you can see checklist items for each use case. We have defined a Pivotal Task for each checklist item, for example, Mocking Services card in Trello has 3 checklist items - one each for use case 1, use case 2 and use case 3, and each checklist has a Pivotal Task assigned to it (shown in WORKSHEET.md). You can see our task tracking for week 1 to week 3 in [WORKSHEET.md](https://github.ncsu.edu/bbansal/AutoBots/blob/master/Docs/WORKSHEET.md).

## Screencast

In [Screencast](https://youtu.be/E4jFcvInCHA) we show AutoBot performs our use cases and our selenium tests are executed.

## Contributions

| Team Member   | Contribution   
| ------------- | ------------ 
| Bhavya Bansal      |  Bot implementation for 3 use cases, Bot interaction        
| Nitish Raghunathan     |    Mocking for 3 usecases, Bot implementation for use case 2
| Pushpendra Singh Patel |    Selenium testing, Bot implementation for usecase 3
| Rezvan Mahdavi Hezaveh  |   Mocking for 3 usecases, Bot implementation usecase 1 , Worksheet
| Tanay Kothari | Selenium testing, Bot implementation for usecase 2

# Design Milestone

#### A step towards the automated future
With the advent of cloud computing, companies these days are moving towards the idea of Virtualization,starting from the very beginning of software development process. Virtualization is the single most effective way to reduce the IT expenses while boosting efficiency and agility of all size businesses. Developers no longer have to wait for the physical hardware, they can get a software based representation of the physical machine with the help of virtualization. 

Problem Statement
---
Developers are responsible for managing their own virtual resources which includes creating virtual machines, installing necessary applications or packages on it and much more. This task itself is time consuming as developers have to undergo a long process of spinning and configuring a new VM using command line utility or web application. Moreover, some developers are not familiar with the process of creating Virtual Machines on numerous cloud providers like Amazon AWS, which makes it harder for them to understand the process first and then proceed with what they were looking for. Moreover, sometimes setting up development environment with IDE’s such as Eclipse is also a painful task as it involves creation of workspaces, installing required plugins and at the end importing all the build projects into the workspace.

These common problems consume most of the developer’s time and companies are looking forward for an automated way to ease this process (and that is why I think, most of the intern projects in companies are about automating common tasks for developers of the team).

Bot Description
---

_Autobot to the rescue: The solution to all the above mentioned problems is our intelligent slackbot: AutoBot_

AutoBot provides a command based interface for provisioning common development setup tasks like creating virtual machines, setting up development workspaces, maintaining the provisioned VMs which includes updating the libraries or editing the VM configuration. With the help of AutoBot, developers can focus and spend their valuable time on more value generating work rather than spending time on configuring the work environment. AutoBot is happy to assist developers in below mentioned tasks:

* **Provisioning a new Virtual Machine:** This is the primary task which AutoBot is designed for. Developers can request creation of virtual machines by providing the desired configuration. Once the request is issued, developers can sit back, relax and let the AutoBot work on the request. The bot will respond back with details to access the virtual machine so that developer can start working immediately. Currently, AutoBot can provision a plain VM or a Jenkins Configured VM. We are planning to add more flavors to the AutoBot repository so that developers will have wide variety of choices.

* **Display list of all virtual machines under a developer access/control:** AutoBot will store and maintain all the virtual machines requested and provisioned for a specific developer so that they can come back and request details about them. AutoBot will make sure that developers can only access the virtual machines provisioned by them and not by any other developers until special permissions have been given.

* **Maintaining a server/ virtual machine:** Developers can request AutoBot for the maintaining their created virtual machines. AutoBot can upgrade distribution packages, edit VM configurations, install third party applications on developer request. In addition, AutoBot can also be used to bring down the unused virtual machines in order to free up space and have better resource utilization. Managers in the team can have additional authority to tear down machines which has not been used or is not required by developers in the team.

* **Setting up local development environment with IDE’s such as Eclipse:** Developers can request AutoBot to setup the development environment for the project they are working on. In addition, developers can request for installation of plugins they need for the development of the software project. Currently, AutoBot supports only Eclipse and some custom plugins. We are planning to extend the capability of AutoBot in future by adding support for more plugins and other IDE’s and also adding natural language processing capabilities so that talking to AutoBot feels more user friendly.

AutoBot will be best fitted into **Responder Bot** category as it is listening to the requests made by the user and then invoking the other modules to serve the request. AutoBot also remembers the user with whom it is talking to, so that bot can manage the work and can provide security with respect to AWS services. AutoBot will also be able to learn from what is being said, for example if a user requests the bot to reconfigure or upgrade some specific virtual machines or request to monitor the state of the machine, then bot will remember about that request and act accordingly.

Use Cases
---
```
Use Case 1: Provision a new Virtual Machine.
1. Preconditions
The user shall have AWS account with valid access keys. User shall also have valid Slack API token on their system

2. Main Flow:
User requests AutoBot to provision a new Virtual Machine [S1].  AutoBot asks about flavor of the requested machine [S2]. User selects the flavor of the VM [S3] AutoBot asks about configuration parameters [S4]. User provides configuration parameters [S5]. AutoBot creates a VM with provided parameters [S6].

3. SubFlows
  [S1] User requests the bot to provision a new Virtual Machine.
  [S2] The AutoBot shows different kinds of VMs to the user to select one of them. (plain   or flavored VM)
  [S3] The user selects one of the provided kind of VM.
  [S4] The AutoBot asks different configuration parameters from the user.
  [S5] The user provides configuration parameters.
  [S6] The AutoBot configured a VM based on the user selections and returns the configuration details of the created VM including access link, and credentials.
  
4. Alternative Flows
  [E1] The AutoBot can not create a new VM based on some errors and return the failure message to the user, example - the user has reached the limit of number of VMs he/she can create.
```

```
Use Case 2 : Show list of all user’s reserved Virtual Machines.
1. Preconditions
  The user shall have AWS account with valid access keys. User shall also have valid  Slack API token on their system.
2. Main Flow
  User requests the AutoBot to show list of all his/her reserved VMs [S1]. The AutoBot shows the list of all his/her reserved VMs [S2].
3. Subflows
  [S1] User requests the AutoBot to show list of all his/her reserved VMs.
  [S2] The AutoBot shows the list of all his/her reserved VMs.
4. Alternative Flows
  [E1] The user has no reserved VMs.
  [E2] The AutoBot can not get the list of user’s reserved VMs based on some errors and return the failure message to the user.
  [E3] User requests list of VMs of another user.
```

```
Use Case 3: Tear down a specific Virtual Machine.
1. Preconditions
  The user shall have AWS account with valid access keys. User shall also have valid  Slack API token on their system. User shall have access to email service to read the OTP sent.
  
2. Main Flow
  User request the AutoBot to tear down a specific VM [S1]. The AutoBot shows all user’s reserved VMs [S2]. The user selects a specific VM [S3].  The Autobot request confirmation from the user (OTP via email) [S4]. The user confirms the request [S5]. The AutoBot tears down the selected VM [S6].
  
3. Subflows
  [S1] User requests the AutoBot to tear down a specific VM.
  [S2] The AutoBot lists all user’s reserved VMs.
  [S3] User selects a specific VM or a set of VM’s to delete.
  [S4] The Autobot request for providing OTP as a confirmation to delete the VM. 
  [S5] The user confirms the request by providing valid OTP.
  [S6] The AutoBot tears down the selected VM.

4. Alternative Flows
  [E1] The AutoBot is not able to delete the VM based on some errors and returns the failure message to the user.
  [E2] The user does not want to delete the VM after entering the main flow and request to go back to main menu.
  [E3] The user provided incorrect OTP, retry again with the OTP in his/her email.
  [E4] AutoBot lock Delete Action for the user, after three incorrect attempts. AutoBot unlocks the delete action, after 10 minutes. 
```

```
Use Case 4: Setup a local Eclipse workspace with selective plugins installed.
1. Preconditions
  User shall have valid Slack API token on their system, and eclipse installed in the environment.

2. Main Flow
  User requests the AutoBot to setup a local Eclipse workspace [S1]. The AutoBot asks location of Eclipse [S2] The user provides the location [S3] The autoBot asks about required plugins[S4]. The user selects desired plugins [S5]. The AutoBot setups Eclipse workspace for the user [S6].
  
3. Subflows
  [S1] User requests the AutoBot to setup a local Eclipse workspace.
  [S2] AutoBot ask the user about the location of eclipse directory on the system.
  [S3] User provide the location of the Eclipse Directory.
  [S4] The AutoBot provides the list of available plugins and ask the user the select some of them. 
  [S5] The user selects desired plugins from the provided list.
  [S6] The AutoBot setups Eclipse workspace with selected plugins installed.

4. Alternative Flows
  [E1] User wants plugins that do not exist in the list of plugins.
  [E2] AutoBot can not find eclipse executable on the provided location by the User
  [E3] AutoBot was not able to install the desired plugins, because of some errors: like internet issue/ download error.
```

```
Use Case 5: Management of Virtual Machines. 
1. Preconditions
  The user shall have AWS account with valid access keys. User shall also have valid  Slack API token on their system

2. Main Flow
  User request the AutoBot to tear down a specific VM [S1]. The AutoBot shows all user’s reserved VMs [S2]. The user selects a specific VM [S3] The AutoBot asks about kind of changing configuration [S4]. The user provides kind of changes he/she wants [S5]. The AutoBot ask required parameters [S6]. The user provides needed parameters [S7]. The Autobot changed the configuration of the selected VM.

3. Subflows
  [S1] User requests the AutoBot to tear down a specific VM.
  [S2] The AutoBot lists all user’s reserved VMs.
  [S3] User selects a specific VM to configure.
  [S4] The AutoBot shows the list of changing configuration items and ask the user to select one of them.
  [S5] The user selects one configuration item.
  [S6] The AutoBot asks required parameter of that configuration. (if needed)
  [S7] The user enters different parameters.
  [S8] The AutoBot changes the configuration of the selected VM based on given parameters.

4. Alternative Flows
  [E1] The AutoBot is not able to configure the VM based on some errors and returns the failure message to the user.
```

Design Sketches
---
#### Wireframe Mockup

![Wireframe](https://github.ncsu.edu/bbansal/AutoBots/blob/master/Docs/Wireframe.png)

#### Storyboards
* Creating a VM

![Creating a VM](https://github.ncsu.edu/bbansal/AutoBots/blob/master/Docs/Storyboard%201.jpg)
---

* Destroying a VM

![Destroying a VM](https://github.ncsu.edu/bbansal/AutoBots/blob/master/Docs/Storyboard%202.jpg)
---

* Setting Up Eclipse Workspace

![Setting Up Eclipse Workspace](https://github.ncsu.edu/bbansal/AutoBots/blob/master/Docs/Storyboard%203.jpg)
---

Architechture Design
---
**Slack** - The AutoBot will have a Slack user-interface on the frontend.The interaction with the Slack interface can be controlled programmatically using a bot user token which can access Slack APIs.The Autobot will listen asynchronously on the channel for direct-messages and slash-commands like '/help' and other messages provided by the user.The bot can work with message threads and reply to conversations.

**Node.js** - For the development of the AutoBot we will use Node.js.It is convenient to use model frameworks such as REST for bot implementation. Since the bot implementation will require to effectively run bunch of API calls and a large number of service requests too.

**Database** - The AutoBot will store information about the user and virtual machines already created by that user and all the applications that have been installed on those virtual machine and their informations.MongoDB offers flexible storage of data ,free   and also provides high availability by having a distributed database in the core. MongoDB is being considered for  bot development.

**Amazon Web Service (AWS)** - The AutoBot will use the services provided by the AWS to create virtual machines using API calls. Users shall have their AWS account setup so that the Bot can use their AWS account for provisioning virtual machines.

**VM Manager** -  The AutoBot will be using the VM Manager for creating, tearing down and modification of a virtual machine such as adjusting the size of the memory, processors and RAM,etc.Based on user requirements the Autobot will instruct the VM Manager to create the virtual environment.

#### Constraints and Guidelines 
* AutoBot responds to only specific commands because we will not use Natural Language Processing.
* AutoBot can perform  only one task at a time.
* Eclipse can be installed only in the local environment.
* It is necessary for the user to have a AWS account.

#### Additional Patterns
We are thinking to design the AutoBot with Command and Adapter Pattern. Command pattern because AutoBot is serving the user requests and Adapter pattern because we are integrating AutoBot with VM manager ( using AWS sdk) and MongoDB, and we will definitely need a bridge between two incompatible interfaces which is what adapter pattern is made for.

#### Future Design 
Natural Language Processing Third-Party - A third party AI service provider like **wit.ai** may be used to have conversation with AutoBot to perform tasks such as spawning a virtual machine.

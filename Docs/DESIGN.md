# Design Milestone

#### A step towards the automated future
With the advent of cloud computing, companies these days are moving towards the idea of virtualization, right from the initial phase of software development process. Virtualization is the single most effective way to reduce the IT expenses while boosting efficiency and agility of all size businesses. Developers no longer have to wait for the physical hardware, instead they just get a software based representation of the physical machine with the help of virtualization. 

Problem Statement
---
Developers are responsible for managing their own virtual resources which includes creating virtual machines, installing necessary applications or packages on it and much more. This task itself is time consuming as developers have to undergo a long process of provisioning and configuring a new VM using command line utility or a web application. Moreover, some developers are not familiar with the process of creating virtual machines on numerous cloud providers like Amazon AWS or Digital Ocean. Also, setting up development environment with IDEs such as Eclipse can be a painful task as it involves creation of workspaces, installing required plugins and finally importing all the build projects into the workspace.

These common problems waste developer's time. For companies looking for an automated way to ease this process, comes Autobot to the rescue: The solution to all these problems.

Bot Description
---

AutoBot provides a command based interface for providing common development setup tasks like creating virtual machines, setting up development workspaces, maintaining the provisioned VMs which includes updating the libraries or editing the VM configuration. With the help of AutoBot, developers can focus and spend their valuable time on more value generating work rather than spending time on configuring the work environment. AutoBot is happy to assist developers in below mentioned tasks:

* **Provisioning a new Virtual Machine:** This is the primary task which AutoBot is designed for. Developers can request creation of virtual machines by providing the desired configuration. Once the request is issued, developers can sit back, relax and let the AutoBot work on the request. The bot will respond back with details to access the virtual machine so that developer can start using it immediately. Currently, AutoBot can provision a plain VM or a Jenkins configured VM. In future, we are planning to increase the flavors of VMs AutoBot can create, so that developers have much more options to choose from.

* **Display list of all virtual machines under a developer access/control:** AutoBot will store and maintain all the virtual machines requested and provisioned for a specific developer so that they can be accessed anytime from anywhere. AutoBot will make sure that developers have their own private _space_ and no other developers can access it until special permissions have been granted.

* **Maintaining a server/ virtual machine:** Developers can request AutoBot for maintaining their virtual machines. AutoBot can upgrade distribution packages, edit VM configurations, install third party applications on developer request. In addition, AutoBot can also be used to bring down the unused virtual machines in order to free up space and have better resource utilization. Managers in the team can have additional authority to tear down machines that have not been used or are not required anymore.

* **Creating a virtual machine image with IDE’s such as Eclipse:** Developers can request AutoBot to create a virtual machine image with eclipse installed on it so that it can be used for the development process. Additionally, developers can specify plugins they wish to be configured with the eclipse IDE. Currently, AutoBot supports only Eclipse IDE and some custom plugins along with it. We are planning to extend this capability of AutoBot in future by adding support for more plugins and other IDEs and also adding natural language processing capabilities so that talking to AutoBot feels more user friendly.

AutoBot will be best fitted into **Responder Bot** category as it is listening to the requests made by the user and then invoking its modules to serve the request. AutoBot also remembers the user its interacting with, so that inherent security and transparency can be provided to the user with respect to AWS services. AutoBot will also be able to learn from what is being said, for example if a user requests AutoBot to reconfigure or upgrade some specific virtual machines, it will remembers the request and acts accordingly.

Use Cases
---
```

Use Case 1: Provision a new Virtual Machine.
1. Preconditions
The user shall have Digital Ocean account with valid access keys. User shall also have valid Slack API token on their system

2. Main Flow:
User requests AutoBot to provision a new Virtual Machine [S1]. AutoBot asks about flavor of the requested machine [S2]. User selects the flavor of the VM [S3] AutoBot asks about configuration parameters [S4]. User provides configuration parameters [S5]. AutoBot creates a VM with provided parameters [S6]. 

3. SubFlows
   [S1] User requests the bot to provision a new Virtual Machine.
   [S2] The AutoBot shows different kinds of VMs to the user to select one of them. (plain   or flavored VM)
   [S3] The user selects one of the provided kind of VM.
   [S4] The AutoBot asks different configuration parameters from the user.
   [S5] The user provides configuration parameters.
   [S6] The AutoBot configured a VM based on the user selections and returns the configuration details of the created VM including access link, and credentials

4. Alternative Flows
   [E1] The AutoBot can not create a new VM based on some errors and return the failure message to the user. - error like the user has reached limit of VM’s he can create.

````
````
  
Use Case 2: Setup virtual machine with Eclipse and selective plugins installed using Packer.
1. Preconditions
User shall have valid Slack API token on their system, and eclipse installed in the environment.

2. Main Flow
User requests the AutoBot for a VM image with Eclipse pre-configured[S1]. AutoBot ask user whether or not to install any specific plugins on the configured eclipse[S2]. The user provides plugins to be installed[S3]. The AutoBot build VM image with eclipse and plugins configured using packer Io and post the image to the user account[S4].

3. Subflows : 
   [S1] User requests the AutoBot to setup a virtual machine image with eclipse installed on it
   [S2] The AutoBot provides the list of available plugins and ask the user to select some of them. 
   [S3] The user selects desired plugins from the provided list.
   [S4]  AutoBot creates a VM image and provides a download link.

4. Alternative Flows
   [E1] User wants plugins that do not exist in the list of plugins which bot can install.
   [E2] AutoBot was not able to install the desired plugins, because of some errors: like internet issue/ download error.

````
````

Use Case 3: Management of Virtual Machines. 
1. Preconditions
The user shall have Digital Ocean account with valid access keys. User shall also have valid  Slack API token on their system. User shall have access to email service to read the OTP sent.

2. Main Flow
User says AutoBot that he wants to manage his VMs[S1]. The AutoBot shows all user’s reserved VMs [S2]. The user selects a specific VM [S3] The AutoBot asks user about desired action on selected VM: delete or configuration change [S4]. The user provides the choice [S5]. The AutoBot ask required parameters if needed [S6]. The user provides needed parameters [S7].The Autobot request confirmation from the user (OTP via email) [S8]. The user confirms the request [S9]. The Autobot changed the selected VM [S10].

3. Subflows
   [S1] User requests the AutoBot to manage VMs.
   [S2] The AutoBot lists all user’s reserved VMs.
   [S3] User selects a specific VM to change.
   [S4] AutoBot ask user to select a specific action for the selected VM: delete or change configuration
   [S5] The user selects one option. It can be one of the configuration change or tear down the machine. 
   [S6] The AutoBot asks required parameter of that configuration. (if needed. For example to tear down the VM no parameter is needed)
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

* Setting Up machine image for use in local virtual environment

![Create downloadable machine image to run on local environment](https://github.ncsu.edu/bbansal/AutoBots/blob/master/Docs/Storyboard%203.jpg)
---

Architecture Design
---
![Architecture](https://github.ncsu.edu/bbansal/AutoBots/blob/master/Docs/AD_Final.jpg)

* **Slack:** The AutoBot will have a Slack user-interface on the frontend. The interaction with slack interface can be controlled programmatically using a bot user token which can access Slack APIs. Autobot will listen asynchronously on the channel for direct-messages and slash-commands like '/help' and other messages provided by the user. The bot can work with message threads and reply in conversations too.

* **Node.js:** For the development of the AutoBot we will use Node.js. It is convenient to use model frameworks such as REST for bot implementation as it will require effectively running a bunch of API calls and large number of service requests too.

* **Database:** AutoBot will store information about the user, configurations of the VMs provisioned to him and all the applications that have been installed on those VMs. MongoDB is free, offers a flexible storage of data and also provides high availability to the user by having a distributed database in the core. Thus MongoDB is being considered for bot development.

* **Packer:** The AutoBot will automate the creation of machine image using Packer. Using packed AutoBot will be able to create machine images that will be available for dowload to the user. These images can be in different formats and be used on a local virtual environment like VirtualBox.

* **Digital Ocean:** The AutoBot will use the services provided by Digital Ocean to create virtual machines using API calls of Packer.

* **VM Manager:**  AutoBot will be using the VM Manager for creating, tearing down and modifying the configuration of VMs (such as adjusting the size of the memory, processors and RAM, etc.). Based on user requirements Autobot will instruct the VM Manager to create a virtual environment.

#### Constraints and Guidelines 
* AutoBot initiates response to basic commands only.
* AutoBot can perform  only one task at a time.
* It is necessary for the user to have a Digital Ocean account.

#### Additional Patterns
We are thinking to design AutoBot with _**command**_ and _**adapter**_ patterns. Command pattern because AutoBot is serving the user requests and adapter pattern because we are integrating AutoBot with VM manager and MongoDB. This requires a bridge between the two incompatible interfaces where the adapter pattern comes in.

#### Future Design 
Natural Language Processing - A third party natural language processing API, for example Api.ai, may be used to have a more human-like conversation with AutoBot and perform tasks such as spawning a virtual machine.

#     SERVICE MILESTONE

### USE CASE 1:
TASK: The user with his digital ocean account keys and valid slack token apis requests the Autobot to provision a new virtual machine.
The user will be given an option to choose a non-flavoured VM or a flavoured VM with Jenkins installed in it.Depending upon the type of virtual machine 
chosen by the user he will be asked the operating system he would prefer.The Autobot supports Ubuntu, Fedora, Centos, Debian, FreeBSD and CoreOS for non-flavoured and Ubuntu, Fedora, Centos and Debian for flavoured VM.

SERVICE: The Autobot upon user request will provision a virtual machine  flavoured/Unflavoured along with the desired operating system.The Autobot also 
takes in RAM size and number of cpu's from the user.Based ont eh parameters given by the user, Packer.io application creates a virtual machine image in his digital ocean account where he can ssh into it.A virtual machine will be created in the user's digital ocean account.We use botkit to intercept and reply
information with user and the Autobot.We use API.AI to have a natural language with the bot.With the help of API calls the VM is created in digital ocean.

### USE CASE 2:
TASK: The user wants a virtual machine with eclipse installed in his local envionment.The user queries the Autobot regarding the operating system,RAM and number of CPU's it can offer.The user provides his choice and the Autobot creates a virtual machine with eclipse installed and provides the link to the user which is GPC(Google CLoud Platform) where he can download the Virtual Machine.Additionally the user has choice to install selected plugins to be installed along with eclipse.Currently the bot supports Spotbugs,Hibernate,Checklist nd Subversive.

SERVICE: Autobot creates a virtual machine of Ubuntu, Fedora, Debian or Centos with eclipse installed on it based on the user selected ram, cpu and eclipse plugins (Spotbugs, Hibernate, Checklist and Subversive).
The Autobot uses the help of Packer.io to create a Virtual Machine with eclispe installed in it.The packer.io application runs shell scripts necessary to install eclipse and it's plugins and with the help oF GPC API, the virtual Machine is uploaded to Google Cloud Platform.The user can then download the VM from the link provided to have eclipse in his local environment.

### USE CASE 3:

TASK: The user can manage his virtual machines by querying th operation he wants to perform to the Autobot.The Autobot can List VMs,delete VMs and also change RAM size per convenience.The User chooses his action to manage by conveying it to the Autobot.

SERVICE: The Autobot then Acts as VM Manager and performs the tasks assigned by the user.The changes can be observed in the Digital Ocean Account of the user.


## WORKSHEET

You can see our task tracking for week 4 to week 6 in [WORKSHEET.md](https://github.ncsu.edu/bbansal/AutoBots/blob/master/Docs/WORKSHEET.md).

## Screencast

In [Screencast](https://youtube.com) we show AutoBot performs our use cases.

## Contributions

| Team Member   | Contribution   
| ------------- | ------------ 
| Bhavya Bansal      |  Use case 1, Use Case 2      
| Nitish Raghunathan     |    Use Case 2, Use Case 1
| Pushpendra Singh Patel |    Use Case 3, Use Case 2
| Rezvan Mahdavi Hezaveh  |   Use Case 2, Use Case 1
| Tanay Kothari | Use Case 2, Use Case 1
 

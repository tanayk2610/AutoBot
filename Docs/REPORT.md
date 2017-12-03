# Autobot Project Report  
  
* The problem our Bot is solving?  
* Primary Features and Screenshots?  

* Bot solutions to problems:  
Currently Developers face the challenge of creating development environments as it involves installing numerous packages and softwares with plugins,which could be tedious and time consuming.
 Another highlight is constant updates to softwares and applications for bug fixes and compatibility with  newer products is to be performed to bolster efficiency and also prevent usage of outdated software.
 Using packet managers to bundle dependencies and also using automation tools such as ansible to automate processes is a viable solution to enhance productivity.
 Autobot performs the above with ease as any developer who requires  an environment say  jenkins server or a software eclipse with plugins installed just needs to instruct the bot to perform actions useful to the developer.  
Handling nested Virtual machines manually could take away precious time from co-workers hence ,Autobot performs VM management ,installation and deployment  saves enormous effort and time, which enables developers to perform other important tasks.The autobot also takes care of security flaws and accidental user mistakes by incorporating OTP system.In the event someone(attacker) other than the developer tries to delete a running virtual machine,the autobot generates a OTP and sends it to user mail account.Without the OTP the the Autobot will not delete the Virtual Machine.  

We have identified three main features for our slack bot, and these are described below:  

##### Provision a new virtual machine:  
Users can provision a new virtual machine on “Digital Ocean”, by providing their desired configurations through a text based chat on Slack. 
Once AutoBot has the required parameters, and the access token for users “Digital Ocean” account, AutoBot will trigger virtual machine creation process and will provide the “IP address” to the users so that they can ssh into it. 
Users can also trigger the process for creating a flavored virtual machine.  
A flavored virtual machine is a plain VM with jenkins already installed on it.   
Note: For creating virtual machines, users first have to save their keys using “Save keys” command.  
Below is a screenshot for the same:  

Below is the screenshot for creating a plain virtual machine:

Below is the screenshot for creating a flavored virtual machine:

##### Create a virtual machine image with eclipse and plugins:  
Users can request AutoBot to create a virtual machine image with eclipse already installed on it. 
Users can also request to install eclipse plugins (we support 4 eclipse plugins at this moment), with the image they have requested.
 AutoBot will ask for parameters such as kind of operating system (we support ubuntu, centos, fedora, debian), RAM size, number of cores requested and then will create an OVF file which users can import in virtualbox installed on their local machine.
 AutoBot will provide a download link from where users can download the generated OVF file.

##### Manage Reservations:  
AutoBot will keep track of all the reservations which users have made on their “Digital Ocean” account. This will help users to review what all machines they have running on digital ocean (resource tracking). AutoBot also provides feature to delete or update an existing reservation. Users can terminate the virtual machine if they no longer need it and can also update the virtual machine configuration based on their needs (re-sizing the droplet). For termination a droplet, AutoBot will send a one time password (OTP) to user's registered email, and users are expected to provide this OTP as a confirmation action for terminating an instance. 
* Reflection on the development process and project?
* Limitations and future work?

Based on the current design and implementation, we have some limitations for our AutoBot project:  

Currently AutoBot only supports virtual machine creation on “Digital Ocean” Platform, and users are required to have their account created on “Digital Ocean”, so that they can create virtual machines using our Slack Bot.
Use case 2 of the bot, which includes creating an image using "Packer" with configurations parameters taken from users, is expected to have random run times based on the performance of the production server (which is controlled by Digital Ocean) and also depends on the virtualization aspects on the production server.
 There have been cases where it has taken 10 minutes to run and there have been cases where it took anytime between 1 hour to 5 hours (approximations).  
AutoBot requests for “Digital ocean token” from users in order to spin virtual machines, and digital ocean tokens have “rate limits” after which they expires and thus can not be used again.
 In such cases, users are requested to save their keys again by providing new “token” to AutoBot.  
 
We have identified some features which are planned for our future release. Some of the planned future work is described below:  

a. We are planning to make AutoBot as platform agnostic, which means adding support for other cloud platforms like Amazon, Azure, Google Cloud platform etc.  
b. We have planned to add a “price feature”, which is a general recommendation from AutoBot to users, before they spin virtual machines on cloud. 
Basically, AutoBot will scour the web based on the requested parameters from users, and then will recommend which cloud platform to go for based on the price per hour for the virtual machine creation.
 This will let users to make an informed decision.  
c. We have also planned to optimize the packer performance by deploying AutoBot, in production environments which supports nested virtualizations. 
We have identified that cloud providers like Amazon, has started providing instances which supports nested virtualization in a clean and neat way.  

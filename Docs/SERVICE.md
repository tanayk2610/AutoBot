#     SERVICE MILESTONE

USE CASE 1:
TASK:The user with his digital ocean account keys and valid slack token apis requests the Autobot to provision a new virtual machine.
The user will be given an option to choose a non-flavoured VM or a flavoured VM with Jenkins installed in it.Depending upon the type of virtual machine 
chosen by the user he will be asked the operating system he would prefer.The Autobot supports Ubuntu,Fedora,Centos and Debian systems.

SERVICE:The Autobot upon user request will provision a virtual machine  flavoured/Unflavoured along with the desired operating system.The Autobot also 
takes in RAM size and number of cpu's from the user.A virtual machine will be created in the user's digital ocean account.We use botkit to ntercept and reply
information with user and the Autobot.We use API.AI to have a natural language with the bot.With the help of APi calls the vm is created in digital ocean.


 

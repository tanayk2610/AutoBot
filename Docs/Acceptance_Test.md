# Acceptance Test

In this document we provide instruction for TAs to test our bot.

## Start using bot
Before start using the bot you should have a Digital Ocean account, API token for your account and ssh id. We created a digital ocean account, API token and ssh id for you and save tham on the bot. 
You can start using bot whit saying "hi" or "hello" to the bot and type "help" to see the list of bot tasks.
![1](https://media.github.ncsu.edu/user/8135/files/e41a907a-cfe2-11e7-9efb-1026d63c310e)

## Use Case 1
In the first use case, bot creates digital ocean vm with Ubuntu, Fedora, Debian or Centos. You can ask the bot to create a plain vm or flavored with jenkins installed on it.
To start you should type "create vm". If you don't provide your API token and ssh key id, Autobot asks you to first save them.
![2](https://media.github.ncsu.edu/user/8135/files/e775db98-cfe3-11e7-8d76-8324c74d83da)

You should type "save keys" to perform this action.
![3](https://media.github.ncsu.edu/user/8135/files/96b15100-cfe4-11e7-8cfc-a92b49cfe7e7)

After typing "create vm" the AutoBot asks you about the operating system, the configuration you want (512mb, 1gb, 2gb, ..) and type of the vm.
You can see four types of operating systems and if you insert something else, you will give an error that your input is incorrect.

If you provide incorrect configuration like 256mb (which Digital Ocean dosen't supprt) or 512 (instead of 512mb) you will give an error that your input is incorrect.
![6](https://media.github.ncsu.edu/user/8135/files/80c3a04e-cfe6-11e7-9340-6c1d2bd305ad)

After inserting all required inputs correct, AutoBot gives you the ip address of your vm and you can ssh to it.
for plain vm:
![4](https://media.github.ncsu.edu/user/8135/files/a4e5f374-cfe5-11e7-88a6-18777a0cf86f)

and for flavored one:
![5](https://media.github.ncsu.edu/user/8135/files/28b53b92-cfe6-11e7-9f03-e9cb10fe7bd2)

## Use Case 2

## Use Case 3

var shell=require('node-cmd');

exports.createImage = function(bot, message, response){
    console.log("******** createImage starts*************");
    bot.reply(message, "Creating image please wait");
    shell.get(
        'ls',
        function(err, data, stderr){
            if(err){
                console.log(err);
            }
            else{
             console.log("****************************** ls = " + data);
            }
        }
    );
    shell.get(
        '../serviceManager/packerService/./packer build config.json',
        function(err, data, stderr){
            if(err){
                console.log(err);
            }
            else{
             console.log(data);
            }
        }
    );
}

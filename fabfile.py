from fabric.api import task
from fabric.api import cd
from fabric.api import env
from fabric.api import run
from fabric.api import local

from slacker import Slacker

env.use_ssh_config = True
env.forward_agent = True
env.port = '22222'
env.user = 'root'
env.hosts = ['s1']
env.webserver = '/opt/webserver/buildout.webserver'
env.code_root = '/var/www/dae'
env.sitename = 'dae'
env.code_user = 'root'
env.prod_user = 'www'

slack = Slacker('xoxp-2440800772-2440800774-2520374751-468e84')


@task
def deploy():
    """ Deploy current master to production server """
    local('git push')
    with cd(env.code_root):
        run('nice git pull')
    msg = '[s1] Christoph Boehner updated dae site'
    user = 'Deployed:'
    icon = ':shipit:'
    slack.chat.post_message('#general', msg, username=user, icon_emoji=icon)

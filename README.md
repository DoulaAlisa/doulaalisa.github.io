# DAE project

This site ist deployed on s1.ade25.de. In order to use the local fabric setup
for automated deployments, you need to setup a dedicated virtualenv.

```bash
/path/to/vitualenv-2.7 dae
cd ./dae
source bin/activate
(dae) pip install Fabric
(dae) pip install slacker
```

Now you should be able to deploy local changes by running

```bash
(dae) fab deploy
```

## Note

Deployment will post a message in the *#dev* slack.com channel.

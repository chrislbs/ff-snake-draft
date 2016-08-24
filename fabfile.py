from fabric import api as fab

images = {
    'ff-snake-draft': {
        'tag': 'ff-snake-draft',
        'file': 'Dockerfile.api'
    },
    'mysql': {
        'tag': 'mysql'
    }
}

containers = {
    'ff-snake-draft': {
        'order': 1,
        'main': True,
        'run': 'nodemon app.js',
        'network': 'ff-snake-draft-network',
        'parameters': [
            ('-p', '6969:8080'),
            ('-e', '"NODE_ENV=local"')
        ]
    },
    'mysql': {
        'order': 0,
        'network': 'ff-snake-draft-network',
        'parameters': [
            ('-e', '"MYSQL_ROOT_PASSWORD=root"'),
            ('-e', '"MYSQL_DATABASE=ff"')
        ]
    }
}

networks = {
    'ff-snake-draft-network': {
        'parameters': [
            ('--driver', 'bridge')
        ]
    }
}


@fab.task
def build():
    # Build the texas-service container
    with fab.settings(warn_only=True):
        for key, settings in images.items():
            if 'file' in settings:
                fab.local('docker build -t {} -f {} .'.format(settings['tag'], settings['file']))
            else:
                fab.local('docker pull {}'.format(settings['tag']))


def startContainers(dev=False, image_name=None):
    for key, settings in sorted(containers.items(), key=lambda x: x[1]['order']):
        if image_name is None or image_name == key:
            with fab.settings(warn_only=True):
                # Kill container if it is running
                if fab.local('docker ps | grep {}'.format(key), capture=True):
                    fab.local('docker kill {}'.format(key))
                # Remove the container if it is present
                if fab.local('docker ps -a | grep {}'.format(key), capture=True):
                    fab.local('docker rm -f {}'.format(key))

            parameters = ''
            if ('parameters' in settings):
                for pair in settings['parameters']:
                    parameters += ' {} {}'.format(pair[0], pair[1])

            if 'network' in settings:
                parameters += ' --network={}'.format(settings['network'])

            run_cmd = ''
            if dev and 'run' in settings:
                run_cmd = ' bash'
            elif 'run' in settings:
                run_cmd = ' ' + settings['run']

            cmd = 'docker run {} -v `pwd`:/app --name {}{} {}{}'.format(
                '-it' if dev and 'main' in settings and settings['main'] else '-d',
                key,
                parameters,
                images[settings['image']]['tag'] if 'image' in settings else images[key]['tag'],
                run_cmd
            )

            fab.local(cmd)


@fab.task
def network():
    for key, settings in networks.items():
        with fab.settings(warn_only=True):
            # Only create the network if it isn't already there
            if not fab.local('docker network ls | grep {}'.format(key), capture=True):
                # Build the parameters
                parameters = ''.join([' {} {}'.format(x[0], x[1]) for x in settings['parameters']]) if 'parameters' in settings else ''

                fab.local('docker network create{} {}'.format(parameters, key))


@fab.task
def up():
    build()
    network()
    startContainers()


@fab.task
def dev(build_images=False, name=None):
    if build_images:
        build()
    network()
    startContainers(dev=True, image_name=name)

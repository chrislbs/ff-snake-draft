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
        'parameters': [
            ('-p', '8080:8080'),
            ('-e', '"NODE_ENV=local"'),
            ('--link', 'mysql:mysql')
        ]
    },
    'mysql': {
        'order': 0,
        'parameters': [
            ('-e', '"MYSQL_ROOT_PASSWORD=root"'),
            ('-e', '"MYSQL_DATABASE=ff"')
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
                if fab.local('docker ps -a | grep {}'.format(key), capture=True):
                    fab.local('docker rm -f {}'.format(key))

            parameters = ''
            if ('parameters' in settings):
                for pair in settings['parameters']:
                    parameters += ' {} {}'.format(pair[0], pair[1])

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
def up():
    build()
    startContainers()


@fab.task
def dev(build_images=False, name=None):
    if build_images:
        build()
    startContainers(dev=True, image_name=name)

config-dev:
	@CONFIG_ENV=dev VERSION=v2 APP=breeze NAMESPACE=config.json FILE_SUFFIX=local ./app/deploy/make_config.sh
config-stable:
	@CONFIG_ENV=stable VERSION=v2 APP=breeze NAMESPACE=config.json ./app/deploy/make_config.sh
config-prepub:
	@CONFIG_ENV=prepub VERSION=v2 APP=breeze NAMESPACE=config.json ./app/deploy/make_config.sh
config-prod:
	@CONFIG_ENV=prod VERSION=v2 APP=breeze NAMESPACE=config.json ./app/deploy/make_config.sh
clean:
	@rm -rf node_modules && echo 'Cleaned.'

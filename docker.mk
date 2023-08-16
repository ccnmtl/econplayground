docker-shell:
	docker compose run web python manage.py shell_plus --settings=econplayground.settings_docker

.PHONY: docker-shell

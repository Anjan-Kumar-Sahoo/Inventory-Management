#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/godown}"

require_non_root() {
  if [[ "${EUID}" -eq 0 ]]; then
    echo "Run as a non-root user with access to docker group."
    exit 1
  fi
}

ensure_env_file() {
  if [[ ! -f "${APP_DIR}/.env" ]]; then
    echo "Missing ${APP_DIR}/.env"
    echo "Copy .env.example to .env and set secrets before deploying."
    exit 1
  fi
}

deploy_stack() {
  cd "${APP_DIR}"
  docker compose pull backend
  docker compose up -d mysql redis
  docker compose up -d --no-build backend
}

post_checks() {
  cd "${APP_DIR}"
  docker compose ps
}

main() {
  require_non_root
  ensure_env_file
  deploy_stack
  post_checks

  echo
  echo "Deployment complete."
  echo "API health: curl -fsS http://127.0.0.1:8080/actuator/health"
}

main "$@"

FROM mcr.microsoft.com/devcontainers/javascript-node:20

# Azure Functions Core Tools と Azure CLI のインストール
RUN wget -q https://packages.microsoft.com/config/ubuntu/22.04/packages-microsoft-prod.deb \
    && dpkg -i packages-microsoft-prod.deb \
    && apt-get update \
    && apt-get install -y azure-functions-core-tools-4 azure-cli \
    && rm packages-microsoft-prod.deb

WORKDIR /workspace
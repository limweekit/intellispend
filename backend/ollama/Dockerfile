FROM ollama/ollama
COPY scripts/start-ollama.sh /backend/start-ollama.sh
RUN chmod +x /backend/start-ollama.sh
ENTRYPOINT ["/backend/start-ollama.sh"]
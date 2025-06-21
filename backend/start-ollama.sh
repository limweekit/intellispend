#!/bin/sh

ollama serve &

sleep 5

ollama pull hf.co/bartowski/Llama-3.2-1B-Instruct-GGUF:latest
tail -f /dev/null
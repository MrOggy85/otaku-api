FROM hayd/alpine-deno:1.5.2

EXPOSE 8000

WORKDIR /app

USER root

# Cache the dependencies as a layer (the following two steps are re-run only when deps.ts is modified).
# Ideally cache deps.ts will download and compile _all_ external files used in main.ts.
COPY src/deps.ts .
RUN deno cache deps.ts

# These steps will be re-run upon each file change in your working directory:
ADD . .
# Compile the main app so that it doesn't need to be compiled each startup/entry.
RUN deno cache src/main.ts

CMD ["deno", "run", "--allow-run", "--allow-env", "--allow-net", "--allow-read", "--allow-write", "./src/main.ts"]

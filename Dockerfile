FROM node:22-bookworm-slim AS build

WORKDIR /app

COPY package.json yarn.lock ./
COPY client/package.json client/
COPY server/package.json server/

RUN yarn install --frozen-lockfile --ignore-scripts

COPY . .

RUN yarn workspace presight-server build \
    && yarn workspace client build

FROM node:22-bookworm-slim AS runtime

WORKDIR /app/server

ENV NODE_ENV=production \
    PORT=3000 \
    DATABASE_PATH=db/app.sqlite3

COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/server/dist /app/server/dist
COPY --from=build /app/server/db /app/server/db
COPY --from=build /app/client/dist /app/client/dist

EXPOSE 3000

CMD ["node", "dist/server.js"]

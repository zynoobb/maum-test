FROM node:16
COPY ./package.json /folder/
COPY ./yarn.lock /folder/
WORKDIR /folder/
RUN yarn install
COPY . /folder/
RUN yarn test
CMD yarn start:dev
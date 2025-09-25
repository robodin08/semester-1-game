FROM node:22-alpine

RUN apk add --no-cache dumb-init

WORKDIR /app

COPY package*.json ./

# Install dependencies
RUN npm install && npm cache clean --force

# Create non-root user for security
RUN addgroup -g 1001 -S app && \
    adduser -S app -u 1001

COPY --chown=app:app . ./

# Switch to non-root user
USER app

RUN ["npm", "run", "build:tailwind"]

# Expose port
EXPOSE 3000

# Start the application with dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "src/app.js"]
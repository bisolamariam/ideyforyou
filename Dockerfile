# Use Node.js LTS as base
FROM node:20-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    wget \
    unzip \
    openjdk-17-jdk \
    android-sdk \
    && rm -rf /var/lib/apt/lists/*

# Set environment variables
ENV ANDROID_HOME=/opt/android-sdk
ENV PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator

# Create android directories
RUN mkdir -p $ANDROID_HOME/cmdline-tools

# Download and install Android command line tools
RUN wget -q https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip -O /tmp/cmdline-tools.zip && \
    unzip -q /tmp/cmdline-tools.zip -d $ANDROID_HOME/cmdline-tools && \
    mv $ANDROID_HOME/cmdline-tools/cmdline-tools $ANDROID_HOME/cmdline-tools/latest && \
    rm /tmp/cmdline-tools.zip

# Accept Android SDK licenses
RUN yes | sdkmanager --licenses

# Install Android SDK components
RUN sdkmanager "platform-tools" "platforms;android-33" "build-tools;33.0.0" "system-images;android-33;google_apis;x86_64"

# Install React Native CLI globally
RUN npm install -g react-native-cli @react-native-community/cli

# Create app directory
WORKDIR /app

# Install watchman (optional but recommended for better performance)
RUN apt-get update && apt-get install -y \
    libssl-dev \
    autoconf \
    automake \
    libtool \
    python3-dev \
    && git clone https://github.com/facebook/watchman.git /tmp/watchman \
    && cd /tmp/watchman \
    && git checkout v2023.01.30.00 \
    && ./autogen.sh \
    && ./configure \
    && make \
    && make install \
    && cd / \
    && rm -rf /tmp/watchman

# Expose Metro bundler port
EXPOSE 8081

# Expose Android Debug Bridge port
EXPOSE 5555

# Start bash by default
CMD ["bash"]
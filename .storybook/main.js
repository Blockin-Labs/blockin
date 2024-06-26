const path = require('path');

module.exports = {
    stories: ['../src/ui/**/*.stories.tsx'],

    // Add any Storybook addons you want here: https://storybook.js.org/addons/
    addons: ['@storybook/addon-styling-webpack'],

    webpackFinal: async (config) => {
        config.module.rules.push({
            test: /\.scss$/,
            use: ['style-loader', 'css-loader', 'sass-loader'],
            include: path.resolve(__dirname, '../'),
        });

        config.module.rules.push({
            test: /\.(ts|tsx)$/,
            loader: require.resolve('babel-loader'),
            options: {
                presets: [['react-app', { flow: false, typescript: true }]],
            },
        });
        config.resolve.extensions.push('.ts', '.tsx');

        return config;
    },

    framework: {
        name: '@storybook/react-webpack5',
        options: {}
    },

    docs: {
        autodocs: true
    }
};

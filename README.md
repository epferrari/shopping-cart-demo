11.8.2015
# Fruit Stand

Open dist/index.html from this repository and start shopping! Select delicious-looking fruits and add them to your shopping cart by tapping the [+] icon next to the fruit's name. Accidentally add a fruit you don't want? That's okay, just tap undo from the snack bar at the bottom of the screen, and the last item you added will be removed from your cart.

If you're looking for a particular fruit, use the sort on in the upper left of the shop, or begin typing in the search field to filter the list of fruits. The filter will eliminate fruits whose name's don't match what you've typed.

Ready to check out? Using the left hand nav menu or the shopping cart icon in the upper right, navigate to your shopping cart. Change the quantity of your selection right from the cart, and tap "Update Cart" to see your total update. In this alpha version, the "Update" button is linked only to its line item, so make sure you tap it after changing a quantity. This functionality is wonky, and is slated to change in the next release.

### Install

- Clone this repo locally.
- From your local project, `npm install` to download dependencies

### Development

- Use `npm run dev` to spin up the dev environment. It builds the project to the `build` directory, opens a browser preview window, and live reloads the browser when your source files change (html,js/jsx,less,and images supported). The `livereload` module lags a bit sometimes, so if you make an change and the browser doesn't update immediately, you may have to command+r.
- modify files in the `src` dir, not _build_ or _dist_
- all of your .js and .jsx files in `src` will be linted on save, and any tests you have written will execute as well. Mocha and Chai are included.
- The `.eslintrc` config file represents best practices syntax. Do not alter without approval from TD.

### Production

- `npm run dist` to minify and concatenate your project into the `dist` directory
- will not open or live reload webpage

### Stop

- `Command + C`
- `npm stop` or `npm run stop` to kill off any child processes

===

###### Questions, Requests, and Issues

contact [Ethan Ferrari](https://github.com/epferrari)<ethan@ethanferrari.com>

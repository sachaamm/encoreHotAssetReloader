# encoreHotAssetReloader
A fixture to improve [Webpack-Encore](https://github.com/symfony/webpack-encore) with hot reload assets files : **css**, **scss** &amp; **js**, for the ease of local development. I made a server in order to work alongside independtly with [Webpack-Encore](https://github.com/symfony/webpack-encore) by ensuring asset hot reloading. I wanted to host this repository as a contrib recipe. **This recipe is working only with Symfony v4.0 or greater.**

## Installation ##
* It assumes that you installed a new Symfony project  
```shell
composer create-project symfony/skeleton my_project 
```
OR
```shell
symfony new --full my_project 
```

* First of all, installing webpack encore is required. 
```shell
composer require encore
```
* Install the package via composer
```shell
composer require sachaamm/encoreHotAssetReloader
```
* Install server dependencies
```shell
cd server/ && yarn install 
```
* Launch webpack encore in watch mode ( at the home folder of your project )
```shell
yarn watch
```
* You need to configure assets entries that you are watching in **server/encoreHar.js**
```javascript

...
// Define your assets entries. It relies on your webpack config. I just left the default app.js & app.css files for simplification purposes
let transpiledEntries = [ 
    { entry:"/assets/js/app.js" , transpiled:"/app.js" },
    { entry:"/assets/css/app.css" , transpiled:"/app.css" }
];

...


```

* You need to edit your webpack.config.js file, located in your project homefolder. A ready-to-use sample config of is included in **server/webpack.sample.config.js** folder. Replace **./webpack.config.js** content by **./server/webpack.sample.config.js** content


* Launch encoreHotAssetReloader. By default, it is running on port 8081
```shell
cd server/ && node encoreHar.js 
```
* This is how looks like my base.html.twig file. I followed instructions for setting up webpack encore [from here](https://symfony.com/doc/current/frontend/encore/simple-example.html). Notice that Jquery is required for Encore HAR

```twig

<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>
            {% block title %}Welcome!
            {% endblock %}
        </title>

        {% block stylesheets %}
            {{ encore_entry_link_tags('app') }}
        {% endblock %}

    </head>
    <body>

        {% block javascripts %}
            {{ encore_entry_script_tags('app') }}
        {% endblock %}

        {% block body %}

          <script src="/encoreHAR/encoreHARJquery/jquery-2.2.4.min.js"  ></script>
          
        {% endblock %}

    </body>
</html>

```

* Launch symfony Web server ( at the home folder of your project )
```shell
php bin/console server:run
```

* Now, go to http://localhost:8000/encore/hot/asset/reloader/example and you will get an asset hot reload example.
You can try to edit /assets/app.css or /assets/app.js file to see the hot reload process.
The hot reload process is happening by including "ehar/ehar.html.twig"

```twig

{% extends 'base.html.twig' %}

{% block title %}Hello HelloController!
{% endblock %}

{% block body %}

    {% include "ehar/ehar.html.twig" %} {# Use this include to add the asset hot reloading in your templates ! #}
    
```




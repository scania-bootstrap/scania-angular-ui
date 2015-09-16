# scania-angular-ui [![Join the chat at https://gitter.im/scania-bootstrap/scania-angular-ui](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/scania-bootstrap/scania-angular-ui?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

This repository contains all Scania extensions, you can either download it or download extensions you like to use separately.

Scania-angular-ui is a set of native AngularJS extensions including a for file upload and gallery on AngularJs framework and a selection box with support for searching, tagging, ng-model, ng-repeat, native HTML select and option tags.
The ```-tpls``` file contains the templates bundled in JavaScript, include it if you want to use default templates we provide or load your custom templates.


###<a href="http://embed.plnkr.co/PlVBJeLgy5CgqED6rzQq/preview">Demo file upload</a>
###<a href="http://embed.plnkr.co/PlVBJeLgy5CgqED6rzQq/preview">Demo lightbox</a>
###<a href="http://embed.plnkr.co/L3YYgq7TEM2mBG9s9we1/preview">Demo select</a>

# Getting Started


##Requirements

<a href="http://getbootstrap.com/">Bootstrap</a><br/>
<a href="https://angularjs.org/">Angular animate</a><br/>
<a href="http://flowjs.github.io/ng-flow/">flow/ng-flow</a><br/>
<a href="https://github.com/ivaynberg/select2">Select2 V3.5.2</a><br/>
<a href="https://github.com/t0m/select2-bootstrap-css/tree/bootstrap3">select2-bootstrap-css V1.4.6</a><br/>
<a href="https://github.com/jashkenas/underscore">Underscore</a><br/>
<a href="http://jquery.com/">JQuery</a><br/>

## Installation

     bower install scania-angular-ui

#Usage

Add the following script to your index.html file and you are good to go :<br/>

    <link href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css" rel="stylesheet" type="text/css">
        or
    <link href="bower_components/scania-bootstrap-ui/css/scania-bootstrap.css" rel="stylesheet" type="text/css">
    <link rel="stylesheet" type="text/css"  href="/bower_components/scania-angular-ui/src/ui-bootstrap/ui-bootstrap-custom-0.13.4-csp.css">
    <link rel="stylesheet" type="text/css" href="bower_components/scania-angular-ui/css/scania-angular-ui.css" >
    <link rel="stylesheet" href="bower_components/select2/select2.css"/><br/>
    <link href="bower_components/select2-bootstrap-css/select2-bootstrap.min.css"  rel="stylesheet" type="text/css">

    <script type="text/javascript" src="bower_components/jquery/jquery.js"></script>
    <script type="text/javascript" src="bower_components/underscore/underscore.js"></script>
    <script src="bower_components/select2/select2.js"></script>
    <script src="bower_components/flow.js/dist/flow.js"></script>
    <script src="bower_components/ng-flow/dist/ng-flow.js"></script>
    <script src="/bower_components/scania-angular-ui/src/ui-bootstrap/ui-bootstrap-custom-tpls-0.13.4.min.js"></script>

    <script src="bower_components/scania-angular-ui/src/scania-angular-ui.js"></script>
    <script src="bower_components/scania-angular-ui/src/scania-angular-ui-tpls.js"></script> (if you want to use default templates boudled with scania-angular-ui)


Next inject the directive into your app

For the full version just change the dependency injection to

       angular.module('yourapp', ['scania.angular.ui']);

##Custom builds

scania-angular-ui provides independently built modules that can be loaded separately

        angular.module('yourapp', [ 'scania.angular.select2', 'scania.angular.lightbox' ]);

#Example

A complete example can be found on respective extension.

 <a href="http://embed.plnkr.co/PlVBJeLgy5CgqED6rzQq/preview">Lightbox</a><br/>
 <a href="http://embed.plnkr.co/L3YYgq7TEM2mBG9s9we1/preview">Select</a>



# Contributions


If you want to contribute, please:

	* Fork the project.
	* Run test (karma start karma.config.js)
	* Make your feature addition or bug fix and test it.
	* Run test to make sure you haven't break anything.
	* Send me a pull request on Github.

## License

scania-angular-ui is released under the [MIT License](http://www.opensource.org/licenses/MIT).
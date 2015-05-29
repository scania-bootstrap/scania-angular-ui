# scania-angular-ui [![Join the chat at https://gitter.im/scania-bootstrap/scania-angular-ui](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/scania-bootstrap/scania-angular-ui?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

This repository contains all Scania extensions, you can either download it or download extensions you like to use separately.

Scania-angular-ui is a set of native AngularJS extensions including a for file upload and gallery on AngularJs framework and a selection box with support for searching, tagging, ng-model, ng-repeat, native HTML select and option tags.

###<a href="http://embed.plnkr.co/PlVBJeLgy5CgqED6rzQq/preview">Demo file upload</a>
###<a href="http://embed.plnkr.co/PlVBJeLgy5CgqED6rzQq/preview">Demo lightbox</a>
###<a href="http://embed.plnkr.co/L3YYgq7TEM2mBG9s9we1/preview">Demo select</a>

# Getting Started


##Requirements

        <a href="http://getbootstrap.com/">Bootstrap</a><br/>
        <a href="https://angularjs.org/">Angular animate</a><br/>
        <a href="http://flowjs.github.io/ng-flow/">flow/ng-flow</a><br/>
        <a href="https://angular-ui.github.io/bootstrap/">UI Bootstrap</a><br/>
        <a href="https://github.com/ivaynberg/select2">Select2 V3.5.2</a><br/>
        <a href="https://github.com/jashkenas/underscore">Underscore</a><br/>
        <a href="http://jquery.com/">JQuery</a><br/>

## Installation

     bower install scania-angular-ui

#Usage


Add the following script to your index.html file and you are good to go :<br/>

    <link href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css" rel="stylesheet" type="text/css">
    <link href="https://static.scania.com/development/global/css/scania-bootstrap.css" rel="stylesheet" type="text/css">
     <link rel="stylesheet" href="bower_components/select2/select2.css"/><br/>
    <link href="scania-angular-ui.css"  rel="stylesheet" type="text/css">

    <script type="text/javascript" src="bower_components/jquery/jquery.js"></script>
    <script type="text/javascript" src="bower_components/underscore/underscore.js"></script>
    <script src="bower_components/select2/select2.js"></script>
    <script src="bower_components/flow.js/dist/flow.js"></script>
    <script src="bower_components/ng-flow/dist/ng-flow.js"></script>

    <script src="bower_components/scania-angular-ui/src/scania-angular-ui-tpls.js"></script> (id you want to use default templates)
    <script src="bower_components/scania-angular-ui/src/scania-angular-ui.js"></script> (is you want to provide your own templates)


Next inject the directive into your app

    angular.module('yourapp', ['scania.angular.ui']);

A complete example can be found on respective extension.

 <a href="http://embed.plnkr.co/PlVBJeLgy5CgqED6rzQq/preview">Lightbox</a><br/>
 <a href="http://embed.plnkr.co/L3YYgq7TEM2mBG9s9we1/preview">Select</a>

For the full version just change the dependency injection to

    angular.module('yourapp', ['scania.angular.ui']);

<h1>Guide to create and start app development using this template</h1>

  

This is a boiler plate app with just having one config field in the app and displaying the config in custom field, sidebar widget and dashboard widget ui locations. This also has a sample server api for webhooks that are triggered from app during the publish event of an entry.

  
  

<h2>Prerequisites</h2>

  

Nodejs - v14.18.2<br/>

  

NPM - 8.1.4<br/>

  

  

<h2>Setting up app repo with package dependencies</h2>

  

  

1. Copy the contents of this repo to the new repo of your APP. The new app repo source folder will be referred as APP_DIRECTORY from now on.

  

2. In the APP_DIRECTORY, update this Readme.md file as per your requirement.

  

3. In the **&lt;APP_DIRECTORY&gt;/ui** Create a npm config file named as .npmrc. Get the contents of that file from the team. It will not be committed in repo as it has secure credentials.

  

4. Go to **<APP_DIRECTORY>/ui** directory in terminal and run following command

  

```

npm i

```

  

5. If the app does not require any api to be available, then remove the contents of **&lt;APP_DIRECTORY&gt;/api** directory.

  

6. If the app requires api, then go to **&lt;APP_DIRECTORY&gt;/api** directory in terminal and run the following command.

```

npm i

```

  

<h2>Naming the app and updating assets</h2>

  

  

7. Open the package.json inside the APP_DIRECTORY (&lt;APP_DIRECTORY&gt;/package.json) and update the name attribute to your app name. Open the package-lock.json inside the APP_DIRECTORY (&lt;APP_DIRECTORY&gt;/package-lock.json) and update the name attribute to your app name.

  

8. Open the package.json inside the ui app (&lt;APP_DIRECTORY&gt;/ui/package.json) and update the name attribute to your app name. Open the package-lock.json inside the ui app (&lt;APP_DIRECTORY&gt;/ui/package-lock.json) and update the name attribute to your app name.

  

9. Open the root html file of app (available at &lt;APP_DIRECTORY&gt;/ui/public/index.html) and update the &lt;title&gt; tag value to the name of your app.

  

10. Change the favicon.ico as per the requirement of your app. favicon.ico file is available at &lt;APP_DIRECTORY&gt;/ui/public/favicon.ico.

  

11. Open the package.json inside the api app (&lt;APP_DIRECTORY&gt;/api/package.json) and update the name attribute to your app name. Open the package-lock.json inside the api app (&lt;APP_DIRECTORY&gt;/api/package-lock.json) and update the name attribute to your app name.

  

  

<h2>Starting the UI and API Servers</h2>

  

  

12. Go to **&lt;APP_DIRECTORY&gt;/ui** directory in terminal and start the ui react server by running 'npm run dev' without quotes. The UI server will start at port 3000.

  

13. Go to **&lt;APP_DIRECTORY&gt;/api** directory in terminal and start the server by running 'npm run dev' without quotes. The API server will start at port 8000.

  

  

<h2>Creating and updating app in ContentStack</h2>

  

  

14. Go to developer hub at https://venus-new.contentstack.com/#!/developerhub

  

15. Create a new app by clicking + New App button at top right and provide a name for your app. This new app name will be referred as NEW_APP from now on.

  

16. After creating NEW_APP, you will be redirected to the Basic Information page. Copy the App UID listed at the bottom. This will be referred as APP_UID from now on.

  

17. Go to postman and call the update app API with below details as per requirement: (Note to change the parameters as per your requirement):

  

```

  

URL: https://developerhub-api.contentstack.com/apps/{{APP_UID}}

  

  

HTTP Method: PUT

  

  

Headers: {

  

authtoken: <auth_token_of_contentstack_account>,

  

organization_uid: <uid_of_organization>

  

}

  

To get an authtoken, refer below API Doc: https://www.contentstack.com/docs/developers/apis/content-management-api/#log-in-to-your-account

  

organization_uid is the org_uid value in the above login API response.

  

```

  

```

  

Body:{

"webhook": {

"signed": true,

"enabled": true,

"target_url": "http://localhost:8000",

"channels": [

"content_types.entries.environments.publish.success"

],

"app_lifecycle_enabled": true,

"retry_policy": "manual"

},

"ui_location": {

"locations": [

{

"type": "cs.cm.stack.custom_field",

"meta": [

{

"signed": true,

"path": "/custom-field",

"name": "Custom Field",

"data_type": "json"

}

]

},

{

"type": "cs.cm.stack.sidebar",

"meta": [

{

"signed": true,

"path": "/sidebar-widget",

"name": "Sidebar Widget",

"data_type": "json"

}

]

},

{

"type": "cs.cm.stack.dashboard",

"meta": [

{

"signed": true,

"path": "/dashboard-widget",

"name": "Dashboard Widget",

"data_type": "json"

}

]

},

{

"type": "cs.cm.stack.config",

"meta": [

{

"signed": true,

"path": "/config",

"name": "Configuration"

}

]

}

],

"signed": true,

"base_url": "http://localhost:3000"

}

}

```

  

  

<h2>Installing the app</h2>

  

  

18. Go to the Developer hub in venus-new.contentstack.com and select the NEW_APP. On the top right click on Install App.

  

19. Select the required stack where the app should get installed.

  

  

<h2>Developing the app and debugging the changes</h2>

  

  

20. After the app is installed in the stack, you can refer the pages developed at various UI locations.

  

Below are the various UI locations and their corresponding page in source code:

  

  

| UI Location | Page Source |

  

|------------------|-------------------------------------------------------------------|

  

| Config Screen | &lt;APP_DIRECTORY&gt;/ui/src/containers/ConfigScreen/index.tsx |

  

| Sidebar Widget | &lt;APP_DIRECTORY&gt;/ui/src/containers/SidebarWidget/index.tsx |

  

| Dashboard Widget | &lt;APP_DIRECTORY&gt;/ui/src/containers/DashboardWidget/index.tsx |

  

| Custom Field | &lt;APP_DIRECTORY&gt;/ui/src/containers/CustomField/index.tsx |

  

| RTE | &lt;APP_DIRECTORY&gt;/ui/src/containers/RTE/index.tsx |

  

  

21. You can change the source codes and refer the changes in UI now at corresponding places as mentioned above. Once developed as expected, commit the changes to your repo.

  

  

<h2>Building and Deploying the app</h2>

  

  

22. To build the app, run build.sh shell script in your terminal. In your terminal go to APP_DIRECTORY and execute 'sh build.sh' without quotes.

  

  

23. The build output will be two zip files - one for api and other for ui. The output will be inside to-deploy folder. Build outputs are:<br/>

  

**&lt;APP_DIRECTORY&gt;/to-deploy/api.zip**<br/>

  

**&lt;APP_DIRECTORY&gt;/to-deploy/ui.zip**

  

  

24. The api.zip can be deployed in AWS Lambda or any other similar services and API gateway trigger can be enabled for that deployment.

  

  

25. The ui.zip is static ui build of react app, which can be deployed in any static serving deployments like AWS S3 and Cloudfront or any other similar service providers.
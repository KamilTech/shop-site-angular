# Responsive shop site with blog and CMS system

This project was made by me in 100%. It doesn't come from any course or tutorial. Now I will introduce a concise description of the possibilities:
- First of all you can register new account then login in and do some stuff. For example you will able to write a new blog, leave comment or like other blogs. Also you can like comment other people.
- When will you have access to the admin account then you will able to choose which post should be shown on an official blog site 
- Only admin have a right to add a new item to the shop
- You can view your entry as well as edit and delete it.
- You can view your profile add or change image
- And more...

## Getting started

First of all you have to install angular cli and mongodb on your machine then go ahead to app folder and install the main node dependencies

../shop-site-angular
```
npm install
```
then you have to change directory into the client folder and do the same for the angular aplication

../client
```
npm install
```
then run mongodb, 
afterwards run nodemon index inside main root 
```
nodemon index
```
and inside client folder 
```
ng serve
```
And start localhost:4200

# Mistakes I made during write this application

### I used jquery
+ In the home.component.ts is useed jquery for transition effect. I should not combine JQuery and Angular. It is not recommended. 
### Disorder in components
+ I create folder components which contains all my component without any division. It is a bad attitude. It should look like this...
For instance:
```
shop-site-angular/
  src/
    components/
      admin/
        admin.module.ts
        admin.component.ts
      dashboard/
        dashboard.module.ts
        dashboard.component.ts
      search/
        search.module.ts
        search.component.ts
```
And if I build out features underneath those pages, I should create more nested folders underneath that feature module.

```
shop-site-angular/
  src/
    components/
      admin/
        profile/
           profile.component.ts
        users/
           users.component.ts
```
### To much code in a single components
+ I have too much code in a single component. I should separate them into smaller component.

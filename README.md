<!-- Heading start-->
<h3 align="center">feature/dashboard</h3>
<p align="center">Angular landing page and dashboard</p>
<ul>
	<li>Client uses Angular</li>
	<li>Server uses Spring Boot</li>

</ul>


<div align="center">
    <picture>
        <img src=".github/logo.png" align="center" width="15%" alt="">
    </picture>
</div>
<hr/>

## Contents
- [Backlog](#backlog)
- [Languages](#languages)
- [Testing](#testing)
- [Screenshots](#screenshots)
- [Demo](#demo)

<a name="backlog"></a>
### Backlog
- [x] Scaffold new app
- [x] TDD with unit testing
- [x] Register page
  - Toggle password 👁️ and 🔒
  - Custom validation:
    - username/email taken
    - password strength
- [x] Login page
  - Forgot Password:
    - user submits their email
    - create a new password
- [x] Asynchronous form validation feedback
- [ ] Deploy
- [ ] Add autocomplete to forms

<a name="languages"></a>
### Languages
<img align="center" src="https://github-readme-stats.vercel.app/api/top-langs?username=james126&langs_count=10&&hide=php" alt="language"/>
<br/>
<hr/>

<a name="testing"></a>
### Testing

[<img src=".github/readme/tests.jpg" style="width:25%"/>](.github/readme/tests.jpg)

<a name="demo"></a>
## Demo
#### Development user testing on localhost

<ul>
    <li>server port 8080</li>
    <li>Postgres port 5432</li>
    <li>client port 80</li>
</ul>

## `Landing page`
[<img src=".github/readme/demo/landing.jpeg" style="width:50%"/>](.github/readme/demo/landing.jpeg)
<br/>

#### `Contact form validation`
[<img src=".github/readme/demo/contact-validation.png" style="width:50%"/>](.github/readme/demo/contact-validation.png)

#### `Error submitting contact form`
[<img src=".github/readme/demo/contact-error.png" style="width:50%"/>](.github/readme/demo/contact-error.png)

#### `Successfully submission`
[<img src=".github/readme/demo/contact-success.png" style="width:50%"/>](.github/readme/demo/contact-success.png)

#### `Server writes record to database`
[<img src=".github/readme/demo/http-contact.png" style="width:100%"/>](.github/readme/demo/http-contact.png)
[<img src=".github/readme/demo/database-contact.png" style="width:100%"/>](.github/readme/demo/database-contact.png)

<hr>

## `Signup form`
#### `Form validation`
[<img src=".github/readme/demo/register-validation.png" style="width:50%"/>](.github/readme/demo/register-validation.png)

#### `Request to check if username is taken`
[<img src=".github/readme/demo/http-username.png" style="width:100%"/>](.github/readme/demo/http-username.png)

#### `Unsuccessful submission`
[<img src=".github/readme/demo/register-error.png" style="width:50%"/>](.github/readme/demo/register-error.png)

#### `Successful submission`
[<img src=".github/readme/demo/register-success.png" style="width:50%"/>](.github/readme/demo/register-success.png)

#### `Record written to database`
[<img src=".github/readme/demo/database-register.png" style="width:100%"/>](.github/readme/demo/database-register.png)

<hr>

## `Forgot Password`
#### `Enter email to receive one-time password`
[<img src=".github/readme/demo/forgot-password-email.png" style="width:50%"/>](.github/readme/demo/forgot-password-email.png)

#### `Password received`
[<img src=".github/readme/demo/temporary-password.png" style="width:50%"/>](.github/readme/demo/temporary-password.png)

#### `Sets accounts temporary attribute true (indicates password is temporary)`
[<img src=".github/readme/demo/database-temporary-true.png" style="width:100%"/>](.github/readme/demo/database-temporary-true.png)

#### `Attempting to login with one-time password prompts user to change it`
[<img src=".github/readme/demo/new-password.png" style="width:100%"/>](.github/readme/demo/new-password.png)

#### `Resetting password sets temporary false (indicates password is not temporary)`
[<img src=".github/readme/demo/database-temporary-false.png" style="width:100%"/>](.github/readme/demo/database-temporary-false.png)

#### `Successfully logged into a dashboard`
[<img src=".github/readme/demo/dashboard.png" style="width:50%"/>](.github/readme/demo/dashboard.png)


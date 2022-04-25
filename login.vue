<template>
<v-app style='background-image: linear-gradient(to bottom right, #009dff, #003dbf);'>
<!--dialogs-->
	<transition name="fade">
		<user 
			:data='user' 
			:params='params'
			v-if='dialogs.user.show'
			@closeDialog='closeDialog($event, "user")'>
		</user>
	</transition>
<!--card-->
	<v-form ref='form' lazy-validation><!--required for this.$refs.form.validate()-->
	<v-card elevation='2' style='width: 450px; text-align: center; margin: 150px auto auto auto;' class='dizagara-outline-blue'>
		<!--logo-->
			<div style='margin: 50px;'>
				<strong style='font-weight: bolder; font-size: 25px; color: gray; text-align: center;'>
					<i class='fa fa-fw fa-bars'></i>FULL-STACK
				</strong>
			</div>
		<!--username textbox-->
			<v-text-field dense outlined
				id='firstFocus'
				append-icon='mdi-account-circle'
				label='Username'
				:rules='[validate.required]'
				placeholder='Type username...'
				v-model='username'
				autocomplete='off'
				background-color='light-blue lighten-5'
				style='margin-left: 30px; margin-right: 30px;'
			></v-text-field>
		<!--password textbox-->
			<v-text-field dense outlined
				append-icon='mdi-lock'
				label='Password'
				:rules='[validate.required]'
				placeholder='Type password...'
				v-model='fruit'
				type='password'
				autocomplete="off"
				background-color='light-blue lighten-5'
				style='margin-left: 30px; margin-right: 30px;'
			></v-text-field>
	<!--action buttons-->
		<v-card-actions style = 'background-color: #2655a9 !important; padding-bottom: 0px;'>
			<v-card-text v-on:keyup.enter='login()'>
			<!--login button-->
				<v-btn dense class='dizagara-button-blue' 
				    v-if="count>0"
					id = "logiBtn"
					style='width: 100%; margin: 0px 0px 10px 0px; font-weight: bold;'
					@click='login()'>
					<span class='mdi' id='loginIcon'></span>
					LOGIN
				</v-btn>
				<v-row class = "align-center">
			<!--register button-->
				<v-btn small class='dizagara-button-blue'
					style='margin: 10px; width: 190px' 
					@click="register()" 
					title='Create an account'>
					<span class='mdi' id='accountIcon'></span>
					REGISTER
				</v-btn>
			<!--recover password-->
				<v-btn small class='dizagara-button-blue'
					style='margin: 10px; width: 190px;' 
					@click='recover()' 
					title='Recover your password.'>
					<span class='mdi' id='passwordIcon'></span>
					PASSWORD
				</v-btn>
				</v-row>
			</v-card-text>
		</v-card-actions>
		</v-card>
		</v-form>
	</v-app>
</template>
<script>
//import
	import bridge from '../bridge.js';
	import references from '../utils/references.js';
	import user from './user.vue';
	import toastr from 'toastr';
	import axios from 'axios';
// variables

//master
    export default {
//name
	name: 'login',
//components
	components: {
		user
	},
// variables

//cycle methods
	//created
		async created(){
		//init timeout 
			setTimeout(() => {
				$('#firstFocus').focus();
				$('#loginIcon').addClass(references.getIcon('login'));
				$('#accountIcon').addClass(references.getIcon('user'));
				$('#passwordIcon').addClass(references.getIcon('password'));
			}, 0);
		//CRUD examples (for reference only)
			//create
			// this is where we are adding to our database
				await bridge.setDocument({
					// collection: `users`,
					// item: {
					// 	_id: `id01`,
					// 	field01: `field01`,
					// 	field02: `field02`,
					// 	field03: `field03`
					// }
					 collection: `users`,
					 item: {
						_id: `id01`,
						field01: `field01`,
					 	field02: `field02`,
						field03: `field03`,
						user: 'user',
						fruit: 'fruit',

					 }
					
				});
			//read
				let read = await bridge.getDocument({
					collection: `users`,
					item: {
						_id: `id01`
					}
				});
				console.log(read);
			//update
			// 
				await bridge.setDocument({
					collection: `users`,
					item: {
						_id: `id01`,
						field01: `modedField01`,
						field02: `modedField02`,
						field03: `modedField03`
					}
				});

			//delete
			// this is where we have to change the code
				await bridge.deleteDocument({
					collection: `users`,
					item: {
						_id: `id01`
					}
				});
		},
//custom methods
	methods: {
	//login
		async login(){
			//validate entries
				 
				if(!this.$refs.form.validate()){

					return;
				}
				try{
				const returnedData = await axios.post('/api/posts/getToken', {username: this.username , fruit: this.fruit});
				console.log("We are printing the returned data now.")
				console.log({returnedData});
                if(returnedData.data ===""){
					if(this.count > 0){
				
					toastr.error("Please provide the correct credentials. You have " + (this.count -1) + " tries left" );
					this.count--;
					}
					if(this.count <=0){
					toastr.error("Too many login attempts were made")
					areTriesOver =true;

				
				}

				}
				else{
					
					this.$router.push({ path: `/dashboard/${this.username}`});
					toastr.success("Logged in succesfully.");


				}
				
				
				

				
			}
			catch(err){
				toastr.error("Coudldn't log in");
				console.log(err);
			}
			
			
			

			//get access token
			//notify based on the token
			//redirect if successful token
			//	this.$router.push({ path: `/dashboard/${this.username}`});
		},
	//create account
		register(){
			this.dialogs.user.show = true;

		},
	//forgot password
		recover(){
			toastr.info(`Ignore this button, no coding required here!`, ``, {'closeButton': true, positionClass: 'toast-bottom-right'});
		},
	//dialogs
		async closeDialog(params, type){
			this.dialogs[type].show = false;
			//save user to database
			//notify
			console.log(params, type);
			// using axios to send data to send to posts.js
			try{
			await axios.post('/api/posts/setUser', params.data);
			toastr.success("Added the user to the database")
			}
			catch(err){
				toastr.error("Couldn't add the user to the database");
				console.log(err);
			}
			
		}
	},
//global vars
	data: () => ({
		username: '',
		fruit: '',
		user: {},
		count: 5,
		validate: {
			required: a => !!a || 'Entry required!'
		},
		params: {},
		dialogs: {
			user: {
				show: false
			}
		}
	}),
}
</script>
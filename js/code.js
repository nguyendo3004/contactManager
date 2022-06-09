const urlBase = 'http://contactmanager.site/LAMPAPI';
const extension = 'php';


let userId = 0;
let firstName = "";
let lastName = "";
let date = 0;
/*Contact Variables */
let contactID = 0;
let contactFName = "";
let contactLastName = "";
let contactPhone = "";
let contactEmail = "";
let contactAddress = "";
let contactNotes = "";



//works!!
function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	

	let Login = document.getElementById("loginName").value;
	
	let Password = document.getElementById("loginPassword").value;
	
	//doesn't allow a user to input a empty string 
	if(Login == "" || Password == ""){
		document.getElementById("loginResult").innerHTML = "Please enter a valid Username and Password";
		return;
	}

//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {Login:Login,Password:Password,DateLastLoggedIn: date};
//	var tmp = {login:login,password:hash};

	let jsonPayload = JSON.stringify(tmp);
	
	let url = urlBase + '/Login.' + extension;


	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				
				let jsonObject = JSON.parse( xhr.responseText );
				
				
				userId = jsonObject.UserID;
				//alert(userId);
				

				if( userId == undefined)
				{		
					document.getElementById("loginResult").innerHTML = "Incorrect Username or Password";
					return;
				}
				
				else{
					firstName = jsonObject.firstName;
					lastName = jsonObject.lastName;

					

					//might need to add readCookie()

					saveCookie();
		
					window.location.href = "contact.html";
				}
			}
		};
		
		xhr.send(jsonPayload);
		
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}
// function updateLoginDate(){

// 	date = new Date();

// 	let url = urlBase + '/DateLastLoggedIn.' + extension;

// 	let xhr = new XMLHttpRequest();
// 	xhr.open("POST", url, true);
// 	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
// 	try
// 	{
// 		xhr.onreadystatechange = function() 
// 		{
// 			if (this.readyState == 4 && this.status == 200) 
// 			{
// 				alert(xhr.responseText );
// 				let jsonObject = JSON.parse( xhr.responseText );
				
// 				userId = jsonObject.UserID;
// 				alert(userId);
// 				if( userId < 1 )
// 				{		
					
// 					return;
// 				}
		
			
// 				date = jsonObject.DateLastLoggedIn;

// 				saveCookie();
	
				
// 			}
// 		};
// 		xhr.send(jsonPayload);
// 	}
	

// }


function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in";
	}
}
//works!!
function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}
//works!!
function addContact()
{
	//the contactText comes from the HTML page
	let FirstName = document.getElementById("firstName").value;
	let LastName = document.getElementById("lastName").value;
	let Phone = document.getElementById("phoneNumber").value;
	let Email = document.getElementById("emailVal").value;
	let Address = document.getElementById("address").value;
	let Notes = document.getElementById("notes").value;
	
	document.getElementById("contactAddResult").innerHTML = "";

	//contact PHP: HTML
	let tmp = {FirstName: FirstName, LastName: LastName, Phone: Phone, Email: Email, 
		Address: Address, Notes: Notes, UserID: userId};

	let jsonPayload = JSON.stringify( tmp );
	//alert(jsonPayload);
	let url = urlBase + '/AddContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactAddResult").innerHTML = "Success! Your new contact has been added!";
			}
		};
		xhr.send(jsonPayload);
		//alert(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}
	
}
//works again!!
function searchContact()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("contactSearchResult").innerHTML = "";
	
	//let contactList = "";
	let contactListTest = "";// TESTING THIS!!


	let tmp = {Search:srch, ID:userId};
	
	let jsonPayload = JSON.stringify( tmp );
	//alert(jsonPayload);
	let url = urlBase + '/Search.' + extension;

	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	
	try
	{
		xhr.onreadystatechange = function() 
		{
			
			if (this.readyState == 4 && this.status == 200) 
			{
				
				document.getElementById("contactSearchResult").innerHTML = "Here are your contacts related to that search!";
				let jsonObject = JSON.parse( xhr.responseText );
				
				
				for( let i=0; i<jsonObject.results.length; i++ )
				{
					
					
					//contactListTest += "<button>" + jsonObject.results[i].FirstName + " " + jsonObject.results[i].LastName + "</button>";
					
					//this line creates a button that displays the first and last name of the contact and takes you to the update contact page
					//this line also stores the contactID and userid in the url that will later be parsed in the update contact page

					contactID = jsonObject.results[i].TableID;
					contactFName = jsonObject.results[i].FirstName;
					contactLastName= jsonObject.results[i].LastName;
					contactAddress = jsonObject.results[i].Address;
					contactEmail = jsonObject.results[i].Email;
					contactPhone = jsonObject.results[i].Phone;
					contactNotes = jsonObject.results[i].Notes;


					//this button displays the contact's name and takes you to the updateContact.html page
					contactListTest += '<button onclick = "window.location.href = \'updateContact.html?contactid=' + contactID + '&userId=' + userId + '&FirstName=' + contactFName + '&LastName=' + contactLastName + '&Phone=' + contactPhone + '&Email=' + contactEmail + '&Address=' + contactAddress + '&Notes=' + contactNotes +  '\'">' +contactFName + ' ' + contactLastName + '</button'; 
				
					 
					// contactLastName= jsonObject.results[i].LastName;
					// contactPhone = jsonObject.results[i].Phone;
					// contactEmail = jsonObject.results[i].Email;
					// contactAddress= jsonObject.results[i].Address;
					// contactNotes = jsonObject.results[i].Notes;
					 



					//empty out the string variables used 
					contactID = 0;
					contactFName = "";
					contactLastName = "";

					if( i < jsonObject.results.length - 1 )
					{
						// contactList += "<br />\r\n";
						contactListTest += "<br />\r\n";
						
					}
				}

				// alert(userId);

			
				

				
				//document.getElementsByTagName("p")[0].innerHTML = contactList;
				document.getElementsByTagName("ul")[0].innerHTML = contactListTest; //TESTING THIS!!!
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}


}
// //this function stores contactID and userID from the URL from Search on the updateContact page and displays the contact info selected
//works!!
function getContactInfo(){
	
	
	const queryString = window.location.search;
	console.log(queryString);

	const urlParams = new URLSearchParams(queryString);

	contactID = urlParams.get('contactid');
	//alert(contactID);
	console.log(contactID);

	userId = urlParams.get('userId');
	//alert(userId);
	console.log(userId);

	contactFName = urlParams.get('FirstName');
	contactLastName= urlParams.get('LastName');
	contactPhone = urlParams.get('Phone');
	contactEmail = urlParams.get('Email');
	contactAddress= urlParams.get('Address');
	contactNotes = urlParams.get('Notes');

	//this code should call the new API and display the info that's returned 
	
	
	let contactListUpdate = "";// TESTING THIS!!


	let tmp = {ContactID: contactID, UserID: userId};
	
	let jsonPayload = JSON.stringify( tmp );
	//alert(jsonPayload);
	let url = urlBase + '/GetInfoByID.' + extension;

	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	
	try
	{
		xhr.onreadystatechange = function() 
		{
			
			if (this.readyState == 4 && this.status == 200) 
			{
				
				document.getElementById("contactUpdateResults").innerHTML = "Here you can edit your contact!";
				let jsonObject = JSON.parse( xhr.responseText );
				
				//alert(jsonPayload);
				//alert(jsonObject.FirstName);
				
				
					
					
					//contactListTest += "<button>" + jsonObject.results[i].FirstName + " " + jsonObject.results[i].LastName + "</button>";
					
					//this line creates a button that displays the first and last name of the contact and takes you to the update contact page
					//this line also stores the contactID and userid in the url that will later be parsed in the update contact page

					
					contactFName = jsonObject.FirstName;
					contactLastName= jsonObject.LastName;
					contactPhone = jsonObject.Phone;
					contactEmail = jsonObject.Email;
					contactAddress= jsonObject.Address;
					contactNotes = jsonObject.Notes;
					//alert(contactFName);
					contactListUpdate += '<label for="contactFName"> <b>First Name</b> </label><br />';
					contactListUpdate += '<p>' + contactFName + '</p>';
					contactListUpdate += '<label for="contactLName"> <b>Last Name</b> </label><br />';
					contactListUpdate += '<p>' + contactLastName + '</p>';
					contactListUpdate += '<label for="contactPh"> <b>Phone Number</b> </label><br />';
					contactListUpdate += '<p>' + contactPhone + '</p>';
					contactListUpdate += '<label for="contactEmail"> <b>Email</b> </label><br />';
					contactListUpdate += '<p>' + contactEmail + '</p>';
					contactListUpdate += '<label for="contactAddress"> <b>Address</b> </label><br />';
					contactListUpdate += '<p>' + contactAddress + '</p>';
					contactListUpdate += '<label for="contactNotes"> <b>Notes</b> </label><br />';
					contactListUpdate += '<p>' + contactNotes + '</p>';

					contactListUpdate += '<button id="updateButton" onclick = "window.location.href = \'anotherupdateContact.html?contactid=' + contactID + '&userId=' + userId +  '\'"> Update Contact</button';
					// contactListUpdate += '<label for="contactFName"> <b>First Name</b> </label><br />';
					// contactListUpdate += '<input type="text" id="contactFNameup" placeholder=" ' + contactFName + '" /><br />';
					// contactListUpdate += '<label for="contactLName"> <b>Last Name</b> </label><br />';
					// contactListUpdate += '<input type="text" id="contactLNameup" placeholder=" ' + contactLastName + '" /><br />';
					// contactListUpdate += '<label for="contactPh"> <b>Phone Number</b> </label><br />';
					// contactListUpdate += '<input type="text" id="contactPhonup" placeholder=" ' + contactPhone + '" /><br />';
					// contactListUpdate += '<label for="contactEmail"> <b>Email</b> </label><br />';
					// contactListUpdate += '<input type="text" id="contactEmailup" placeholder=" ' + contactEmail + '" /><br />';
					// contactListUpdate += '<label for="contactAddress"> <b>Address</b> </label><br />';
					// contactListUpdate += '<input type="text" id="contactAddressup" placeholder=" ' + contactAddress + '" /><br />';
					// contactListUpdate += '<label for="contactNotes"> <b>Notes</b> </label><br />';
					// contactListUpdate += '<input type="text" id="contactNotesup" placeholder=" ' + contactNotes + '" /><br />';
				

					//empty out the string variables used 
					//contactID = 0;
					//contactFName = "";
					//contactLastName = "";


			
				

				
				//document.getElementsByTagName("p")[0].innerHTML = contactList;
				document.getElementsByTagName("ul")[0].innerHTML = contactListUpdate; //TESTING THIS!!!
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactUpdateResults").innerHTML = err.message;
	}



}
//works!!
function doCreateUser(){

	let FirstName = document.getElementById("userFirst").value;
	let LastName = document.getElementById("userLast").value;
	let Login = document.getElementById("loginNew").value;
	let Password = document.getElementById("pwNew").value;
	
	document.getElementById("newUser").innerHTML = "";

	let tmp = {FirstName: FirstName, LastName: LastName, Login: Login, Password: Password};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddUser.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("newUser").innerHTML = "Your account was successfully created!";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("newUser").innerHTML = err.message;
	}

	//takes the user to the contact page after creating account
	window.location.href = "contact.html";

}
//gets userid and contactid from the update contact page to go to anotherupdateContact page
///in the anotherupdateContact page I want to display the contact info on top of the input text entry!
function getUserandContactID(){
	const queryString = window.location.search;
	console.log(queryString);

	const urlParams = new URLSearchParams(queryString);

	contactID = urlParams.get('contactid');
	//alert(contactID);
	console.log(contactID);

	userId = urlParams.get('userId');
	//alert(userId);
	console.log(userId);

	

	//alert(userId);
	//alert(contactID);

}
//Works!!
function updateContact(){

	
	
	//userId = 1;
	//alert(userId);
	//alert(contactID);
	//alert(contactFName);
	//alert(contactLastName);
	
	let FirstName = document.getElementById("firstName").value;
	let LastName = document.getElementById("lastName").value;
	let Phone = document.getElementById("phoneNumber").value;
	let Email = document.getElementById("emailVal").value;
	let Address = document.getElementById("address").value;
	let Notes = document.getElementById("notes").value;
	// let srch = document.getElementById("firstNametoUpdate").value;
	// alert(srch);
	
	 document.getElementById("contactUpdateResult").innerHTML = "";

	

	let tmp = {ContactID: contactID, UserID: userId, NewFirstName: FirstName, NewLastName: LastName, NewPhone: Phone, NewEmail: Email, 
		NewAddress: Address, NewNotes: Notes };
	let jsonPayload = JSON.stringify(tmp);
	alert(jsonPayload);

	let url = urlBase + '/UpdateContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactUpdateResult").innerHTML = "Contact has been updated!";
			}
		};
		xhr.send(jsonPayload);
		alert(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactUpdateResult").innerHTML = err.message;
	}

}

//works!!
function deleteContact(){

	
	if (confirm("Are you sure you want to delete this contact?")) {
		
		

		let tmp = {ContactID: contactID, UserID: userId};
		//alert(tmp);
		let jsonPayload = JSON.stringify(tmp);
		//alert(tmp);
		//alert(jsonPayload);

		let url = urlBase + '/DeleteContact.' + extension;
		
		let xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		try
		{
			xhr.onreadystatechange = function() 
			{
				if (this.readyState == 4 && this.status == 200) 
				{
					document.getElementById("contactDeleteResult").innerHTML = "Contact has been deleted!";
				}
			};

			xhr.send(jsonPayload);
			//alert(jsonPayload);
		}
		catch(err)
		{
			document.getElementById("contactDeleteResult").innerHTML = err.message;
		}
	}

	
}
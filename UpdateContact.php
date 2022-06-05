<?php
	$inData = getRequestInfo();

	$TableID = $inData["ContactID"];
	$UserID = $inData["UserID"];

    $NewFirstName = $inData["NewFirstName"];
    $NewLastName = $inData["NewLastName"];
    $NewPhone = $inData["NewPhone"];
    $NewEmail = $inData["NewEmail"];
    $NewAddress = $inData["NewAddress"];
    $NewNotes = $inData["NewNotes"];
    
    


	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("UPDATE Contacts SET FirstName='".$NewFirstName."', LastName='".$NewLastName."',Phone='".$NewPhone."',Email='".$NewEmail."',Address='".$NewAddress."',Notes='".$NewNotes."' WHERE ID='".$TableID."'");
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("");
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}

	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

?>

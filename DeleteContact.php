<?php

    $inData = getRequestInfo();

    $Phone = $inData["Phone"];
	$UserID = $inData["UserID"];
	
    //connects to database
    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 

    //successful connection test
    else
    {
        $stmt = $conn->prepare("DELETE FROM Contacts where UserID='".$UserID."' and Phone='".$Phone."'");
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

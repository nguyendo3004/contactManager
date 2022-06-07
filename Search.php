
<?php

	$inData = getRequestInfo();

    $searchCount = 0;
    $searchResults = "";

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		//$stmt = $conn->prepare("SELECT * from Contacts where (FirstName like'%".$inData["Search"]."%' or LastName like '%".$inData["Search"]."%' or Phone like '%".$inData["Search"]."%' or Email like '%".$inData["Search"]."%' or Address like '%".$inData["Search"]."%') and UserID='".$inData["ID"]."'");
        $stmt = $conn->prepare("SELECT * from Contacts where CONCAT(FirstName,' ', LastName,' ', Phone, ' ', Email,' ', Address) like '%".$inData["Search"]."%' and UserID='".$inData["ID"]."'");
		$stmt->execute();
		$result = $stmt->get_result();

		while ( $row = $result->fetch_assoc()  )
		{
			if ($searchCount > 0) {
                $searchResults .= ",";
            }
            $searchCount++;
            $searchResults .= '{"FirstName" : "'.$row["FirstName"].'", "LastName" : "'.$row["LastName"].'", "Phone" : "'.$row["Phone"].'", "Email" : "'.$row["Email"].'", "Address" : "'.$row["Address"].'", "Notes" : "'.$row["Notes"].'", "TableID" : "'.$row["ID"].'"}';
		}
		if ($searchCount == 0) {
            returnWithError("No Records Found");
        } else {
            returnWithInfo($searchResults);
        }

		$stmt->close();
		$conn->close();
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
	
	function returnWithInfo( $searchResults )
	{
		sendResultInfoAsJson( '{"results":[' . $searchResults . '],"error":""}' );
	}
	
?>

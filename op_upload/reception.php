<?php

$_FILES['mon_fichier']['name']     //Le nom original du fichier, comme sur le disque du visiteur (exemple : mon_icone.png).
$_FILES['mon_fichier']['type']     //Le type du fichier. Par exemple, cela peut être « image/png ».
$_FILES['mon_fichier']['size']     //La taille du fichier en octets.
$_FILES['mon_fichier']['tmp_name'] //L'adresse vers le fichier uploadé dans le répertoire temporaire.
$_FILES['mon_fichier']['error']    //Le code d'erreur, qui permet de savoir si le fichier a bien été uploadé.

if ($_FILES['mon_fichier']['error'] > 0) $erreur = "Erreur lors du transfert";

if ($_FILES['mon_fichier']['size'] > $maxsize) $erreur = "Le fichier est trop gros";

$extensions_valides = array( 'jpg' , 'jpeg' , 'gif' , 'png' );
//1. strrchr renvoie l'extension avec le point (« . »).
//2. substr(chaine,1) ignore le premier caractère de chaine.
//3. strtolower met l'extension en minuscules.
$extension_upload = strtolower(  substr(  strrchr($_FILES['mon_fichier']['name'], '.')  ,1)  );
if ( in_array($extension_upload,$extensions_valides) ) echo "Extension correcte";

$image_sizes = getimagesize($_FILES['mon_fichier']['tmp_name']);
if ($image_sizes[0] > $maxwidth OR $image_sizes[1] > $maxheight) $erreur = "Image trop grande";

//Créer un dossier 'fichiers/1/'
  mkdir('fichiers/1/', 0777, true);
 
//Créer un identifiant difficile à deviner
  $nom = md5(uniqid(rand(), true));

$nom = "avatars/{$id_membre}.{$extension_upload}";
$resultat = move_uploaded_file($_FILES['mon_fichier']['tmp_name'],$nom);
if ($resultat) echo "Transfert réussi";  

?>

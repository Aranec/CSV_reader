<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class CsvController extends AbstractController
{
    #[Route('/{csvName}/read', name: 'csv_read')]
    public function read(
        Request $request
    ): Response
    {
        $nbRow = 0;
        $data = [];

        $categoryName = $request->get('categoryName');
        $csvName = $request->get('csvName');

        $csvPath = '../public/csv_categories/'.$categoryName.'/'.$csvName;

        $csv = new \SplFileObject($csvPath);

        if(!strpos($csv->fgets(), ';')){


            //lecture d'un fichier csv où les données sont séparées
            //par des virgules, et les en-têtes par des retour à la ligne
            //SplFileObject ne nous permet pas d'utiliser '\n' comme séparateur
            $csvContents = file_get_contents($csvPath);
            $rows = explode("\n", $csvContents);

            $headers = str_getcsv(array_shift($rows), ',');
            $data[] = $headers;
            $nbCol = count($headers);

            foreach ($rows as $row) {
                $data[] = str_getcsv($row, ',');
                $nbRow++;
            }
        }else {
            //On précise la lecture du fichier au format CSV
            // -> meilleur perf
            $csv->setFlags(\SplFileObject::READ_CSV);
            //On indique que ';' est notre délimiteur de champs pour la lecture
            $csv->setCsvControl(';');
            //On replace le pointeur du stream au début du fichier
            $csv->rewind();

            //On recupere la premiere ligne du fichier pour recuperer le nom des colonnes
            $firstLine = $csv->fgets();
            //nous renvoie un tableau avec les valeurs de la premiere ligne
            //qui sont séparées par ';'
            $headers = str_getcsv($firstLine, ';');


            //On ajoute les en-têtes a notre tableau de données
            $data[] = $headers;
            //On recupère le nombre d'en-têtes
            $nbCol = count($headers);

            //On lit le fichier (tant que le fichier csv contient des données...
            while($row = $csv->fgets()){

                //On ajoute chaque row lue, et on sépare les données par ';'
                $data[] = str_getcsv($row, ';');
                $nbRow++;
            }
        }

    if($request->get('left_limit') && $request->get('right_limit')){

        //on set la limite gauche et droite, càd à partir de quelle colonne on veut lire
        // et jusqu'à laquelle
        $left = $request->get('left_limit');
        $right = $request->get('right_limit');

        //array_map nous permet d'appliquer la fonction array_slice a chaque ligne du tableau $data
        $data = array_map(function($row) use ($left, $right) {
            return array_slice($row, $left, ($right - $left) + 1); // +1 car la plage est de type : [...[
        }, $data);
    }

        return $this->render('csv/read.html.twig', [
            'controller_name' => 'CsvController',
            'nbCol' => $nbCol,
            'nbRow' => $nbRow,
            'data' => $data,
            'csvName' => $csvName,
            'categoryName' => $categoryName
        ]);
    }
}

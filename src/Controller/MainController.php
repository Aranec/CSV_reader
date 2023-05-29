<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class MainController extends AbstractController
{
    #[Route('/', name: 'main_index')]
    public function index(): Response
    {
        return $this->render('main/index.html.twig', [
            'controller_name' => 'MainController',
        ]);
    }

    #[Route('/categories', name: 'main_categories')]
    public function categories(): Response
    {
        $pathCategories = $this->getParameter('kernel.project_dir') . '/public/csv_categories';
        $directoriesCategories = array_filter(glob($pathCategories . '/*'), 'is_dir');


        return $this->render('main/categories.html.twig', [
            'controller_name' => 'MainController',
            'directoriesCategories' => $directoriesCategories
        ]);
    }

    #[Route('/category', name: 'main_category')]
    public function category(
        Request $request
    ): Response
    {

        $categoryName = $request->get('categoryName');
        $pathCategory = $this->getParameter('kernel.project_dir') . '/public/csv_categories/' . $categoryName;
        $csvCategory = array_filter(glob($pathCategory . '/*'), 'is_file');


        return $this->render('main/category.html.twig', [
            'controller_name' => 'MainController',
            'categoryName' => $categoryName,
            'CSVs' => $csvCategory
    ]);
    }

    #[Route('/test', name: 'main_test')]
    public function test(): Response
    {
        return $this->render('main/test.html.twig', [
            'controller_name' => 'MainController',
        ]);
    }
}

"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { translate, translateToJa } from "../libs/translate";

export default function Home() {
  const [ingredient, setIngredient] = useState("");
  const [showContent, setShowContent] = useState(false);

  type Recipe = {
    recipe: {
      label: string;
      calories: number;
      image: string;
      digest: string;
    };
  };

  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    // アニメーション終了後にコンテンツを表示
    const timer = setTimeout(() => setShowContent(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const fetchRecipes = async () => {
    const translatedIngredient = await translate(ingredient);

    const response = await fetch(
      `https://api.edamam.com/search?q=${translatedIngredient.translations[0].text}&app_id=${process.env.NEXT_PUBLIC_APPLICATION_ID}&app_key=${process.env.NEXT_PUBLIC_APPLICATION_KEYS}`
    );
    if (!response.ok) {
      console.error("APIからのレスポンスが失敗しました。");
      return;
    }

    const data = await response.json();
    const translatedRecipes = await Promise.all(
      data.hits.map(async (recipe: any) => {
        const translatedLabel = await translateToJa(recipe.recipe.label);
        return {
          ...recipe,
          recipe: {
            ...recipe.recipe,
            label: translatedLabel.translations[0].text,
          },
        };
      })
    );
    setRecipes(translatedRecipes);
  };

  if (!showContent) {
    return (
      <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
        <Image
          src="/mafia.jpeg" // ここにハゲの人の画像パスを指定
          alt="ハゲの人"
          layout="fill"
          objectFit="cover"
          className="mx-auto your-element-class"
        />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">u-recipe</h1>
        <div className="mb-4">
          <input
            type="text"
            value={ingredient}
            onChange={(e) => setIngredient(e.target.value)}
            placeholder="具材を入力"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
          />
          <button
            onClick={fetchRecipes}
            className="mt-4 w-full bg-purple-500 text-white p-2 rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:-translate-y-1 shadow-md"
          >
            検索
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {recipes.map((recipe, index) => (
            <div
              key={index}
              className="bg-white rounded-lg overflow-hidden shadow-lg transform transition duration-300 hover:scale-105"
            >
              <h2 className="text-xl font-bold text-gray-900 p-4">
                {recipe.recipe.label}
              </h2>
              <p className="px-4 pb-4">カロリー:{recipe.recipe.calories}</p>
              <div className="overflow-hidden">
                <Image
                  src={recipe.recipe.image}
                  alt={recipe.recipe.label}
                  width={300}
                  height={300}
                  layout="responsive"
                  className="transition duration-300 ease-in-out transform hover:scale-110"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

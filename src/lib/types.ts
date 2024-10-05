export enum CategoryType {
	CARDS = "CARDS",
	DISCOUNTS = "DISCOUNTS",
	PLACES = "PLACES",
}

export interface Coord {
	lat: number;
	lng: number;
}

export interface Place {
	location: Coord;
	name: string;
	createdAt: Date; // дата создания
	description: string; //Описание
	linkToPhoto: string; // массив строк для URL картинок

	author: User; // Ссылка на автора

	isActive: boolean; // логическое значение для статуса
	
	category: CategoryType;
	
}

export interface PlacesGroup {
	title: string;
	places: Place[];
}


export interface User {

	username: string; // Имя пользователя
	email: string; // Email пользователя
	institution: Institution; //Вуз участника

  }


  // Интерфейс для учебного заведения
export interface Institution {
	
	location: Coord;
	name: string; // Название учебного заведения
	city: string; // Город или местоположение учебного заведения 
}
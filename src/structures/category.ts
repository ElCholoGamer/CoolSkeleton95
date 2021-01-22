class Category {
	private constructor(public readonly displayName: string) {}

	public static INFO = new Category('Info');
	public static FUN = new Category('Fun');
	public static ECONOMY = new Category('Economy');
	public static OWNER = new Category('Owner');
}

export default Category;

class Category {
	private constructor(
		public readonly displayName: string,
		public readonly showHelp = true
	) {}

	public static INFO = new Category('Info');
	public static FUN = new Category('Fun');
	public static ECONOMY = new Category('Economy');
	public static OWNER = new Category('Owner', false);
}

export default Category;

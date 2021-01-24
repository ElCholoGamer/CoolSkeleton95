class Category {
	private constructor(
		public readonly displayName: string,
		public readonly showHelp = true
	) {}

	public static INFO = new Category('INFO');
	public static FUN = new Category('FUN');
	public static ECONOMY = new Category('ECONOMY');
	public static OWNER = new Category('OWNER', false);
}

export default Category;

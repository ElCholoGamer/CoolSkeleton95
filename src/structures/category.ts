class Category {
	private constructor(
		public readonly displayName: string,
		public readonly showHelp = true
	) {}

	public static INFO = new Category('INFO');
	public static FUN = new Category('FUN');
	public static RPG = new Category('RPG');
	public static OWNER = new Category('OWNER', false);
}

export default Category;

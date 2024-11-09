package helpers

func GetUniqueStrings(s []string) []string {
	if len(s) == 0 {
		return nil
	}

	m := make(map[string]struct{})
	for _, v := range s {
		m[v] = struct{}{}
	}

	var res []string
	for k := range m {
		res = append(res, k)
	}

	return res
}

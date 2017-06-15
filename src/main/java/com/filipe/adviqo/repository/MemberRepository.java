package com.filipe.adviqo.repository;

import com.filipe.adviqo.model.Member;
import org.springframework.data.repository.CrudRepository;

public interface MemberRepository extends CrudRepository<Member, Long> {
}
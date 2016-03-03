//
//  EHMApplicant.m
//  eHireMe-iOS
//
//  Created by Mac Liu on 2/19/16.
//  Copyright © 2016 eHireMe. All rights reserved.
//

#import "EHMApplicant.h"

@implementation EHMApplicant

- (id)initWithDictionary:(NSDictionary *)dictionary {
    self = [super init];
    
    if (self) {
        self.name = [dictionary objectForKey:@"name"];
        self.email = [dictionary objectForKey:@"email"];
        self.age = [[dictionary objectForKey:@"age"] integerValue];
        self.bio = [dictionary objectForKey:@"bio"];
        self.city = [dictionary objectForKey:@"city"];
        self.state = [dictionary objectForKey:@"state"];
        self.dob = [dictionary objectForKey:@"dob"];
    }
    
    return self;
}

@end
